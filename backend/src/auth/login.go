package auth

import (
	"context"
	"cow-templates/src/database"
	"cow-templates/src/database/models"
	"cow-templates/src/middleware"
	"time"

	"github.com/gofiber/fiber/v2"
)


func Login(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid input")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := database.DB.WithContext(ctx).Where("email = ?", data["email"]).First(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "wrong email or password"})
	}

	if user.Id == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "wrong email or password"})
	}

	if !user.IsVerified {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "email is not verified"})
	}

	if err := user.ComparePassword(data["password"]); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "wrong email or password"})
	}

	expirationTime := time.Now().Add(160 * time.Hour)
	token, err := middleware.GenerateJWT(user.Id, "user")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "could not login"})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  expirationTime,
		HTTPOnly: true,
	}

	c.Cookie(&cookie)
	c.Set("Authorization", "Bearer "+token)

	return c.JSON(fiber.Map{
		"login":  "success",
		"cookie": cookie,
	})
}


func User(c *fiber.Ctx) error {
	id, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "token is malformed: " + err.Error()})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := database.DB.WithContext(ctx).Where("id = ?", id).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "token is malformed: user not found"})
	}

	token, err := middleware.GenerateJWT(user.Id, "user")
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "could not generate token"})
	}

	expirationTime := time.Now().Add(160 * time.Hour).UTC()

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  expirationTime,
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	avatarURL := user.ImageUrl

	return c.JSON(fiber.Map{
		"imageUrl":         avatarURL,
		"subscriptionId":   user.StripeSubscriptionID,
		"subscriptionPlan": user.Plan,
		"name":             user.Name,
		"email":            user.Email,
		"token":            token,
		"cookie":           cookie,
	})
}
