package stripeRoutes

import (
	"cow-templates/src/middleware"

	"github.com/gofiber/fiber/v2"

	"cow-templates/src/controllers/stripeController"
)

func SetupStripeRoutes(router fiber.Router) {
	checkout := router.Group("/checkout", middleware.IsAuthenticated)

	checkout.Get("/", stripeController.HandleStripeCheckoutCreate)
	checkout.Get("/success", stripeController.HandleStripeCheckoutSuccess)
	checkout.Post("/cancel", stripeController.HandleStripeCheckoutCancel)
	checkout.Post("/manage-subscription", stripeController.HandleManageSubscription)

}
