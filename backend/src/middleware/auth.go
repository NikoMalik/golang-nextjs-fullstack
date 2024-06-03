package middleware

import (
	"sync"
	"time"

	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/patrickmn/go-cache"
	"gorm.io/gorm"

	"cow-templates/src/database"
	"cow-templates/src/database/models"

	"cow-templates/src/logger"
)

var (
	userCache  = cache.New(5*time.Minute, 10*time.Minute)
	adminCache = cache.New(5*time.Minute, 10*time.Minute)
	sessionMu  sync.Once
)

var SessionStorage *session.Store

func init() {
	sessionMu.Do(func() {
		SessionStorage = session.New(session.Config{
			KeyLookup:  "cookie:jwt",
			Expiration: 24 * time.Hour,
		})
	})
}

func IsAuthenticated(c *fiber.Ctx) error {
	var user *models.User

	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &ClaimsWithScope{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil || !token.Valid {
		return unauthorized(c)
	}

	payload, ok := token.Claims.(*ClaimsWithScope)
	if !ok {
		return unauthorized(c)
	}

	switch payload.Scope {
	case "admin":
		_, found := getAdminFromCache(payload.Subject)
		if !found {
			admin, err := getAdminFromDatabase(database.DB, payload.Subject)
			if err != nil {
				return internalServerError(c)
			}
			adminCache.Set(payload.Subject, admin, cache.DefaultExpiration)
		}
	case "user":
		_, found := getUserFromCache(payload.Subject)
		if !found {
			user, err := getUserFromDatabase(database.DB, payload.Subject)
			if err != nil {
				return internalServerError(c)
			}
			userCache.Set(payload.Subject, user, cache.DefaultExpiration)
		}

		if user != nil {
			session, _ := SessionStorage.Get(c)
			session.Set("isVerified", user.IsVerified)
			session.Save()
		}
	default:
		return unauthorized(c)
	}

	return c.Next()
}

func unauthorized(c *fiber.Ctx) error {
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"message": "unauthenticated",
	})
}

func internalServerError(c *fiber.Ctx) error {
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"message": "internal server error",
	})
}

func getAdminFromCache(adminID string) (*models.Admin, bool) {
	admin, found := adminCache.Get(adminID)
	if found {
		return admin.(*models.Admin), true
	}
	return nil, false
}

func getUserFromCache(userID string) (*models.User, bool) {
	user, found := userCache.Get(userID)
	if found {
		return user.(*models.User), true
	}
	return nil, false
}

func getAdminFromDatabase(db *gorm.DB, adminID string) (*models.Admin, error) {
	admin := &models.Admin{}
	result := db.First(admin, "id = ?", adminID)
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected == 0 {
		return nil, nil
	}
	return admin, nil
}

func getUserFromDatabase(db *gorm.DB, userID string) (*models.User, error) {
	user := &models.User{}
	result := db.First(user, "id = ?", userID)
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected == 0 {
		return nil, nil
	}
	return user, nil
}

func RoleMiddleware(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		session, err := SessionStorage.Get(c)
		if err != nil {
			logger.Error("Failed to get session:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal server error",
			})
		}

		userId := session.Get("Id")
		if userId == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		}

		var user interface{}
		if session.Get("isAdmin") == "true" {
			admin, err := models.GetAdminByID(database.DB, userId.(string))
			if err != nil {
				logger.Error("Failed to find admin in the database:", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Internal server error",
				})
			}
			user = admin
		} else {
			regularUser, err := models.GetUserByID(database.DB, userId.(uint))
			if err != nil {
				logger.Error("Failed to find user in the database:", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Internal server error",
				})
			}
			user = regularUser
		}

		switch role {
		case "admin":
			if _, ok := user.(*models.Admin); !ok {
				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
					"error": "Unauthorized action",
				})
			}

		default:
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Invalid role specified",
			})
		}

		return c.Next()
	}
}

func CreateSessionForUser(c *fiber.Ctx, user *models.User) error {
	session, err := SessionStorage.Get(c)
	if err != nil {
		logger.Error("Failed to get session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	session.Set("Id", user.Id)
	session.Set("Name", user.Name)

	if err := session.Save(); err != nil {
		logger.Error("Failed to save session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	cookie := fiber.Cookie{

		Name:     "session_id",
		Value:    session.ID(),
		Expires:  time.Now().Add(SessionStorage.Config.Expiration),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Strict",
	}

	c.Cookie(&cookie)

	return nil
}
