package controllers

import (
	"cow-templates/src/database"
	"cow-templates/src/database/models"

	"github.com/gofiber/fiber/v2"
)

func GetUsers(c *fiber.Ctx) error {
	var users []models.User

	database.DB.Where("is_user = true").Find(&users)

	return c.JSON(users)
}
