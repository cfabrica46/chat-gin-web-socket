package database

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
	Deadline string `json:"deadline"`
	Token    string `json:"token"`
}

type Token struct {
	Content string `header:"Authorization"`
}
