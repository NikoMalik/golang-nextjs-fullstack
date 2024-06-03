package adminRoutes

import (
	"github.com/gofiber/fiber/v2"

	"cow-templates/src/middleware"
)

func SetupRoutes(router fiber.Router) {
	admin := router.Group("/admin", middleware.IsAuthenticated, middleware.RoleMiddleware("admin"))

	admin.Get("/users")
	admin.Get("/users/:userId")
	admin.Put("/users/:userId")
	admin.Delete("/users/:userId")
}
