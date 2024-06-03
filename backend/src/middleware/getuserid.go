package middleware

import (
	"errors"
	"strconv"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gofiber/fiber/v2"
)

func GetUserId(c *fiber.Ctx) (uint, error) {
	cookie := c.Cookies("jwt")

	if cookie == "" {
		return 0, errors.New("no jwt cookie")
	}

	token, err := jwt.ParseWithClaims(cookie, &ClaimsWithScope{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		return 0, err
	}

	payload, ok := token.Claims.(*ClaimsWithScope)
	if !ok {
		return 0, errors.New("unable to get user id from jwt")
	}

	id, err := strconv.Atoi(payload.Subject)
	if err != nil {
		return 0, err
	}

	return uint(id), nil
}

func RequireSession(c *fiber.Ctx) error {
	_, err := GetUserId(c)
	if err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	return c.Next()
}
