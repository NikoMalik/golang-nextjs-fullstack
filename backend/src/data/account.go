package data

type Plan string

const (
	Free     Plan = "Free"
	Business Plan = "Business"
	Pro      Plan = "Pro"
)

func (p Plan) String() string {
	return string(p)
}

func PlanFromString(s string) Plan {

	switch s {
	case "Free":
		return Free
	case "Business", "Business Plan":
		return Business
	case "Pro", "Pro Plan":
		return Pro
	default:
		return Free
	}
}
