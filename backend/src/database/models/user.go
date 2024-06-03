package models

import (
	"cow-templates/src/data"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	Model
	Name         string    `json:"name"`
	Email        string    `json:"email" gorm:"unique"`
	Password     []byte    `json:"-"`
	RegisteredAt time.Time `json:"registeredAt" gorm:"registeredAt"`
	LastVisitAt  time.Time `json:"lastVisitAt" gorm:"lastVisitAt"`
	UpdatedAt    time.Time `json:"updatedAt" gorm:"updatedAt"`
	IsVerified   bool      `json:"isverified" gorm:"default:false"`

	IsUser bool `json:"-"`

	NotifyUpfront      int
	NotifyDefaultEmail string
	NotifyWebhookURL   string

	ImageUrl             string    `json:"imageUrl"`
	StripeCustomerID     string    `json:"-" gorm:"stripe_customer_id"`
	StripeSubscriptionID string    `json:"-" gorm:"stripe_subscription_id"`
	SubscriptionStatus   string    `json:"-" gorm:"subscription_status"`
	Plan                 data.Plan `json:"plan" gorm:"default:Free"`
	Session              []Session `json:"-" gorm:"foreignKey:Id"`
}

func (user *User) SetPassword(password string) {
	hashedpassword, _ := bcrypt.GenerateFromPassword([]byte(password), 12)
	user.Password = hashedpassword
}

func (user *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword(user.Password, []byte(password))
}

// auth
func GetUserByID(db *gorm.DB, id uint) (*User, error) {
	user := &User{}
	res := db.First(user, "id = ?", id)
	if res.Error != nil {
		return nil, res.Error
	}
	return user, nil
}

// for stripe sessions
func GetUserAccount(db *gorm.DB, id string) (*User, error) {
	user := &User{}
	res := db.First(user, "id = ?", id)
	if res.Error != nil {
		return nil, res.Error
	}
	return user, nil
}

// GetUsersByEmail returns all users with the given email
func GetUsersByEmail(db *gorm.DB, email string) ([]User, error) {
	var users []User
	res := db.Where("email = ?", email).Find(&users)
	return users, res.Error
}
