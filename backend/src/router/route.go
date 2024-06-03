package router

import (
	authRoutes "cow-templates/src/routes/authRoutes"

	"cow-templates/src/controllers/stripeController"

	stripeRoutes "cow-templates/src/routes/stripeRoutes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func Setup(app *fiber.App) {
	api := app.Group("/api", logger.New())

	api.Post("/webhook", stripeController.HandleStripeWebhook)

	authRoutes.SetupAuthRoutes(api)

	stripeRoutes.SetupStripeRoutes(api)

}
