package database

import (
	"context"
	"cow-templates/src/database/models"
	"cow-templates/src/logger"
	"time"

	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

func Connect() (*gorm.DB, error) {

	var dsn = "user=postgres password=postgres dbname=postgres host=localhost port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}),
		&gorm.Config{
			SkipDefaultTransaction: true,
			PrepareStmt:            true,
			NowFunc:                func() time.Time { return time.Now().UTC() },
		})

	if err != nil {
		logger.Errorf("failed to connect to postgres: %v", err)
		return nil, err
	}

	err = DB.Exec("SET search_path = public").Error
	if err != nil {
		logger.Errorf("failed to set search_path: %v", err)
		return nil, err
	}

	return DB, nil
}

func AutoMigrate() error {
	if DB == nil {
		return fmt.Errorf("database connection not established")
	}

	ctx := context.Background()

	err := DB.WithContext(ctx).AutoMigrate(
		&models.User{},
		&models.Admin{},
	)
	if err != nil {
		logger.Errorf("failed to auto migrate user model: %v", err)
		return err
	}

	logger.Info("Database Migrated🎉")
	return nil
}
