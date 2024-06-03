package auth

import (
	"context"
	"cow-templates/src/database"
	"cow-templates/src/database/models"
	"cow-templates/src/middleware"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
)

func UpdateInfo(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid input")
	}

	id, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "unauthorized"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user := models.User{}
	if err := database.DB.WithContext(ctx).First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "user not found"})
	}

	if password, exists := data["password"]; exists && password != "" {
		if err := user.ComparePassword(data["old_password"]); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "wrong old password"})
		}
		user.SetPassword(password)
	}

	if name, exists := data["name"]; exists {
		user.Name = name
	}
	if email, exists := data["email"]; exists {
		user.Email = email
	}
	if image, exists := data["image_url"]; exists {
		user.ImageUrl = image
	}

	if err := database.DB.WithContext(ctx).Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "internal server error"})
	}

	return c.JSON(fiber.Map{"message": "user updated", "user": user})
}

func RefreshToken(c *fiber.Ctx) error {
	manager, err := middleware.NewManager(middleware.SecretKey)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create token manager")
	}

	token, err := manager.NewRefreshToken()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to generate new refresh token")
	}

	return c.JSON(fiber.Map{"message": "refresh token updated", "token": token})
}

func UpdateImage(c *fiber.Ctx) error {
	id, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "unauthorized"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user := models.User{}
	if err := database.DB.WithContext(ctx).First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "user not found"})
	}

	file, err := c.FormFile("image")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid image file")
	}

	imagePath := filepath.Join("static", file.Filename)
	if err := c.SaveFile(file, imagePath); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save image")
	}

	imageURL := "http://localhost:8000/static/" + file.Filename
	user.ImageUrl = imageURL
	if err := database.DB.WithContext(ctx).Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "internal server error"})
	}

	return c.JSON(fiber.Map{"message": "image updated", "user": user, "image_url": imageURL})
}
