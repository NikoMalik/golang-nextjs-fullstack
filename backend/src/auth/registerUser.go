package auth

import (
	"context"
	"cow-templates/src/database"
	"cow-templates/src/database/models"
	"cow-templates/src/email"
	"cow-templates/src/logger"
	"cow-templates/src/middleware"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gofiber/fiber/v2"
)

var tokenManager *middleware.Manager

type verificationRequest struct {
	Token string `json:"token"`
}

func init() {
	var err error
	tokenManager, err = middleware.NewManager(middleware.SecretKey)
	if err != nil {
		panic(err)
	}
}

func Register(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid input")
	}

	if len(data["password"]) < 6 {
		return c.Status(400).JSON(fiber.Map{"message": "password must be at least 6 characters"})
	}

	if data["password"] != data["password_confirm"] {
		return c.Status(400).JSON(fiber.Map{"message": "passwords do not match"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := database.DB.WithContext(ctx).Where("email = ?", data["email"]).First(&user).Error; err == nil {
		return c.Status(400).JSON(fiber.Map{"message": "user already exists"})
	} else if !strings.Contains(err.Error(), "record not found") {
		return fmt.Errorf("failed to check for existing user: %w", err)
	}

	user.Name = data["name"]
	user.Email = data["email"]
	user.IsUser = true
	user.SetPassword(data["password"])

	if err := database.DB.WithContext(ctx).Create(&user).Error; err != nil {
		return err
	}

	verificationToken, err := generateVerificationToken(user.Id)
	if err != nil {
		return fmt.Errorf("failed to generate verification token: %w", err)
	}

	err = email.SendVerificationEmail(user.Email, verificationToken)
	if err != nil {
		logger.Error("Error sending verification email:", err)
		return errors.New("failed to send verification email")
	}

	if err := middleware.CreateSessionForUser(c, &user); err != nil {
		return err
	}

	session, _ := middleware.SessionStorage.Get(c)
	session.Set("isVerified", user.IsVerified)
	session.Save()

	return c.JSON(fiber.Map{"message": "Registration successful. Please verify your email to activate your account."})
}

func generateVerificationToken(userId uint) (string, error) {
	claims := middleware.ClaimsWithScope{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: jwt.At(time.Now().Add(24 * time.Hour)),
			Subject:   strconv.Itoa(int(userId)),
		},
	}

	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(middleware.SecretKey))
}

func VerifyEmailHandler(c *fiber.Ctx) error {
	var req verificationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Error decoding request body"})
	}

	token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(middleware.SecretKey), nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrSignatureInvalid) {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Invalid verification token"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": fmt.Sprintf("Error verifying token: %v", err)})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Invalid token format"})
	}

	userID, ok := claims["sub"].(string)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Invalid token format: user ID claim missing or invalid"})
	}

	userIdInt, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Invalid token format: user ID claim not a valid integer"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := database.DB.WithContext(ctx).Model(&models.User{}).Where("id = ?", uint(userIdInt)).First(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": fmt.Sprintf("Error finding user: %v", err)})
	}

	user.IsVerified = true
	if err := database.DB.WithContext(ctx).Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": fmt.Sprintf("Error updating user: %v", err)})
	}

	return c.JSON(fiber.Map{"message": "Email address verified successfully!"})
}
