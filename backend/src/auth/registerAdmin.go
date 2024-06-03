package auth

import (
	"cow-templates/src/database"
	"cow-templates/src/database/models"
	"cow-templates/src/middleware"
	"time"

	"github.com/gofiber/fiber/v2"
)

func init() {

	var err error
	tokenManager, err = middleware.NewManager(middleware.SecretKey)
	if err != nil {
		panic(err)
	}
}

func RegisterAdmin(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["password"] != data["password_confirm"] {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "passwords do not match",
		})
	}

	if len(data["password"]) < 6 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "password must be at least 6 characters",
		})
	}

	admin := models.Admin{
		FirstName: data["first_name"],
		LastName:  data["last_name"],
		Email:     data["email"],
		IsAdmin:   true,
	}

	admin.SetPassword(data["password"])

	if err := database.DB.Create(&admin).Error; err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not create admin",
		})
	}

	token, err := middleware.GenerateJWT(admin.Id, "admin")
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not generate token",
		})
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  expirationTime,
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Admin registered successfully",
		"admin":   admin,
	})
}
