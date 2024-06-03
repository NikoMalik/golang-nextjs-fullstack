package authRoutes

import (
	authController "cow-templates/src/auth"
	"cow-templates/src/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoutes(router fiber.Router) {
	auth := router.Group("/auth")

	auth.Get("/me", authController.User)
	auth.Post("/login", authController.Login)

	auth.Post("/register", authController.Register)
	auth.Post("/updateInfo", middleware.IsAuthenticated, authController.UpdateInfo)
	auth.Post("/refresh", authController.RefreshToken)

	auth.Post("/logout", middleware.IsAuthenticated, authController.Logout)
	auth.Post("/verify-email", authController.VerifyEmailHandler)
	auth.Post("/update-avatar", middleware.IsAuthenticated, authController.UpdateImage)

}
