package database

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
	Deadline string `json:"deadline"`
	Token    string `json:"token"`
}
