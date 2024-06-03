package data

const (
	StatusHealthy      = "healthy"
	StatusExpires      = "expires"
	StatusExpired      = "expired"
	StatusInvalid      = "invalid"
	StatusOffline      = "offline"
	StatusUnresponsive = "unresponsive"
)

const (
	StripeStatusActive            = "active"
	StripeStatusPastDue           = "past_due"
	StripeStatusUnpaid            = "unpaid"
	StripeStatusCanceled          = "canceled"
	StripeStatusIncomplete        = "incomplete"
	StripeStatusIncompleteExpired = "incomplete_expired"
	StripeStatusTrialing          = "trialing"
	StripeStatusPaused            = "paused"
)

func IsPlanActive(s string) bool {
	return s == StripeStatusActive
}
