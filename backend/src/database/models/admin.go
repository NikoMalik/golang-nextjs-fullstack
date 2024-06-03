package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Admin struct {
	Model
	FirstName          string    `json:"first_name"`
	LastName           string    `json:"last_name"`
	Email              string    `json:"email" gorm:"unique"`
	PasswordHash       []byte    `json:"-"`
	IsAdmin            bool      `json:"-"`
	RegisteredAt       time.Time `json:"registeredAt" gorm:"registeredAt"`
	LastVisitAt        time.Time `json:"lastVisitAt" gorm:"lastVisitAt"`
	AccumulatedRevenue float64   `json:"revenue"`
}

func (a *Admin) SetPassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	a.PasswordHash = hash
	return nil
}

func (a *Admin) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword(a.PasswordHash, []byte(password))
}

func GetAdminByID(db *gorm.DB, id string) (*Admin, error) {
	admin := &Admin{}
	res := db.First(admin, "id = ?", id)
	if res.Error != nil {
		return nil, res.Error
	}
	return admin, nil
}
