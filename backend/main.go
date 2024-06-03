package main

import (
	"runtime/debug"
	"time"

	"cow-templates/src/database"
	"cow-templates/src/logger"
	"cow-templates/src/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			logger.Error("Recovered from:", r)
			logger.Debug(string(debug.Stack()))
		}
	}()

	logger.Info("cow-templates BACKEND SERVER starting...")

	logger.Info("Connecting to database...")
	database.Connect()

	logger.Info("Running database migrations...")
	database.AutoMigrate()

	app := fiber.New()
	app.Static("static", "./static")

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, credentials",
	}))

	app.Use(limiter.New(limiter.Config{
		Max:        10,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	}))

	logger.Info("Setting up routes...")
	router.Setup(app)

	logger.Info("cow-templates BACKEND SERVER starting on port 8000...")

	logger.Info(app.Listen(":8000"))
}
