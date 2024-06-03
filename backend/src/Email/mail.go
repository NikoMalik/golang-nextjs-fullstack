package email

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"html/template"
	"net/smtp"
	"os"
)

//go:embed templates/*
var templatesFS embed.FS

type VerificationRequest struct {
	Email string `json:"email"`
	Token string `json:"token"`
}

func SendVerificationEmail(recipient, token string) error {

	sender := os.Getenv("SMTP_SENDER")
	if sender == "" {
		return errors.New("smtp sender not provided")
	}

	smtpServer := os.Getenv("SMTP_SERVER")
	if smtpServer == "" {
		return errors.New("smtp server not provided")
	}

	smtpUsername := os.Getenv("SMTP_USERNAME")
	if smtpUsername == "" {
		return errors.New("smtp username not provided")
	}

	smtpPassword := os.Getenv("SMTP_PASSWORD")
	if smtpPassword == "" {
		return errors.New("smtp password not provided")
	}

	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "587" // default
	}

	auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpServer)

	tmpl, err := template.ParseFS(templatesFS, "templates/verification_email.html")
	if err != nil {
		return fmt.Errorf("error parsing email template: %w", err)
	}
	htmlContent := new(bytes.Buffer)

	verificationLink := fmt.Sprintf("http://localhost:3000/verify-email?token=%s", token)

	err = tmpl.Execute(htmlContent, struct {
		Token            string
		VerificationLink string
	}{	
		Token:            token,
		VerificationLink: verificationLink,
	})

	msg := []byte(fmt.Sprintf("To: %s\r\n"+"From: %s\r\n"+"Subject: Verify your email address\r\n"+
		"MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n%s", recipient, sender, htmlContent))

	err = smtp.SendMail(fmt.Sprintf("%s:%s", smtpServer, smtpPort), auth, sender, []string{recipient}, msg)
	if err != nil {
		return err
	}

	return nil
}

func VerifyEmail(req VerificationRequest) error {

	fmt.Printf("Verifying email: %s with token: %s\n", req.Email, req.Token)
	return nil
}
