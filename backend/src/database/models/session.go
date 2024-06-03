package models

import "time"

type Session struct {
	Model
	Token     string `gorm:"unique"`
	UserId    uint
	ExpiresAt time.Time
}
