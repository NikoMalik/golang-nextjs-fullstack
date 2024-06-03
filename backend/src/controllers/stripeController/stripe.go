package stripeController

import (
	"encoding/json"
	"errors"
	"os"
	"regexp"
	"time"

	"cow-templates/src/data"
	"cow-templates/src/database"
	"cow-templates/src/database/models"
	"cow-templates/src/middleware"

	"cow-templates/src/logger"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/stripe/stripe-go/v78"
	portalsession "github.com/stripe/stripe-go/v78/billingportal/session"
	"github.com/stripe/stripe-go/v78/checkout/session"
	"github.com/stripe/stripe-go/v78/webhook"
	"gorm.io/gorm"
)

func init() {
	godotenv.Load()
	stripe.Key = os.Getenv("STRIPE_KEY")
}

func isValidEmail(email string) bool {

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func HandleStripeCheckoutCreate(c *fiber.Ctx) error {
	id, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "token is malformed: " + err.Error(),
		})
	}

	priceId := c.Query("priceId")
	if priceId == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Price ID is required"})
	}

	planStr := c.Query("plan")
	if planStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Plan is required"})
	}

	logger.Info("Plan: ", planStr)

	var user models.User
	if err := database.DB.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to find user in the database"})
	}

	if user.Email == "" || !isValidEmail(user.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid email address"})
	}

	params := &stripe.CheckoutSessionParams{
		CustomerEmail:      stripe.String(user.Email),
		SuccessURL:         stripe.String("http://localhost:3000/success?sessionId={CHECKOUT_SESSION_ID}"),
		CancelURL:          stripe.String("http://localhost:3000/cancel"),
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		Mode:               stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceId),
				Quantity: stripe.Int64(1),
			},
		},
	}

	session, err := session.New(params)
	if err != nil {
		logger.Error("Failed to create checkout session: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create checkout session"})
	}

	if err := database.DB.Model(&user).Updates(map[string]interface{}{
		"stripe_customer_id": session.ID,
		"plan":               planStr,
	}).Error; err != nil {
		logger.Error("Failed to save stripe_customer_id and plan in the database: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user in the database"})
	}

	return c.JSON(fiber.Map{"sessionId": session.ID, "plan": planStr})
}

func HandleStripeCheckoutSuccess(c *fiber.Ctx) error {
	sessionId := c.Query("sessionId")
	if sessionId == "" {
		logger.Error("Session ID is required")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Session ID is required"})
	}

	checkoutSession, err := session.Get(sessionId, nil)
	if err != nil {
		logger.Error("Failed to get session: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get session"})
	}

	subscriptionID := checkoutSession.Subscription.ID
	if subscriptionID == "" {
		logger.Error("No subscription found")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No subscription found"})
	}

	customerID := checkoutSession.Customer.ID
	if customerID == "" {
		logger.Error("No customer found")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No customer found"})
	}

	var user models.User
	if err := database.DB.Where("stripe_customer_id = ? OR stripe_customer_id = ?", customerID, sessionId).First(&user).Error; err != nil {
		logger.Error("Failed to find user in the database: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to find user in the database"})
	}

	updates := map[string]interface{}{
		"stripe_subscription_id": subscriptionID,
		"stripe_customer_id":     customerID,
		"subscription_status":    string(checkoutSession.Subscription.Status),
	}

	if err := database.DB.Model(&user).Updates(updates).Error; err != nil {
		logger.Error("Failed to update user in the database: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user in the database"})
	}

	return c.JSON(fiber.Map{"message": "Subscription created successfully"})
}

func HandleManageSubscription(c *fiber.Ctx) error {
	userID, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "token is malformed: " + err.Error(),
		})
	}

	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		logger.Error("Failed to find user in the database: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to find user in the database"})
	}

	if user.StripeCustomerID == "" {
		logger.Error("User does not have a Stripe customer ID")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User does not have a Stripe customer ID"})
	}

	params := &stripe.BillingPortalSessionParams{
		Customer:  stripe.String(user.StripeCustomerID),
		ReturnURL: stripe.String("http://localhost:3000/"), // replace with your URL
	}

	s, err := portalsession.New(params)
	if err != nil {
		logger.Error("Failed to create billing portal session: ", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create billing portal session"})
	}

	return c.JSON(fiber.Map{"url": s.URL})
}

func HandleStripeCheckoutCancel(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Subscription cancelled successfully"})
}

func HandleStripeWebhook(c *fiber.Ctx) error {
	body := c.Request().Body()

	endpointSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	signature := c.Get("Stripe-Signature")

	event, err := webhook.ConstructEvent(body, signature, endpointSecret)
	if err != nil {
		logger.Error("Error verifying webhook signature: ", err.Error())
		return c.SendStatus(fiber.StatusBadRequest)
	}

	switch event.Type {
	case "customer.subscription.updated":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			logger.Error("Error parsing webhook JSON: ", err.Error())
			return c.SendStatus(fiber.StatusBadRequest)
		}

		plan := convertProductNameToPlan(subscription.Items.Data[0].Price.Product.ID)
		if plan == data.Free {
			logger.Error("Invalid plan")
			return c.SendStatus(fiber.StatusBadRequest)
		}

		err := updateSubscriptionInfo(subscription.ID, subscription.Customer.ID, plan.String(), string(subscription.Status))
		if err != nil {
			logger.Error("Failed to update user subscription: ", err.Error())
			return c.SendStatus(fiber.StatusInternalServerError)
		}

		logger.Info("Subscription updated for customer: ", subscription.Customer.ID)

	case "customer.subscription.deleted":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			logger.Error("Error parsing webhook JSON: ", err.Error())
			return c.SendStatus(fiber.StatusBadRequest)
		}

		plan := convertProductNameToPlan(subscription.Items.Data[0].Price.Product.ID)
		if plan == data.Free {
			logger.Error("Invalid plan")
			return c.SendStatus(fiber.StatusBadRequest)
		}

		err := updateSubscriptionInfo(subscription.ID, subscription.Customer.ID, plan.String(), string(subscription.Status))
		if err != nil {
			logger.Error("Failed to update user subscription: ", err.Error())
			return c.SendStatus(fiber.StatusInternalServerError)
		}
		logger.Info("Subscription deleted for customer: ", subscription.Customer.ID)

	default:
		logger.Info("Unhandled event type: ", event.Type)
	}

	return c.SendStatus(fiber.StatusOK)
}

func updateSubscriptionInfo(subscriptionID, customerID, plan, status string) error {

	err := database.DB.Model(&models.User{}).Where("stripe_subscription_id = ? AND stripe_customer_id = ? AND deleted_at IS NULL", subscriptionID, customerID).Updates(map[string]interface{}{
		"plan":                plan,
		"subscription_status": status,
		"updated_at":          time.Now(),
	}).Error
	if err != nil {
		return err
	}
	return nil
}

func convertProductNameToPlan(productID string) data.Plan {
	switch productID {
	case "your product name from stripe your name of example - prod_q38178414gadfh ", "Pro", "Pro Plan":
		return data.Pro

	case "your product name from stripe your name of example - prod_q38178414gadfh", "Business", "Business Plan":
		return data.Business
	default:
		return data.Free
	}
}
