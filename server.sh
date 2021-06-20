#!/bin/bash

#Signin
curl -X POST http://localhost:8080/api/v1/signin -d '{"username":"cfabrica46","password":"01234"}'

#SignUp
curl -X POST http://localhost:8080/api/v1/signup -d '{"username":"cfabrica4","password":"789"}'

#Profile
#curl -X GET http://localhost:8080/user -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTYXQgTWF5IDI5IDEwOjE0OjI4IDIwMjEiLCJpZCI6IjYwYjFjNDkyNGFiMjkzZGU5NjFkYTBlNyIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiY2ZhYnJpY2E0NiIsInV1aWQiOiI3OWVhOGVjNi0xMmNhLTRjZjktYmFjYi0zOTBkODI4Yzg0YjEifQ.82ZvIygphY_-rzdk_nEF48ZOgfhwhxWzIXTRNU8cnTU"

#ShowUsers
#curl -X GET http://localhost:8080/users

#Delete

#Update
#curl -X PUT http://localhost:8080/user -d '{"username":"uwu","password":"owo"}' -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTYXQgTWF5IDI5IDEwOjE0OjI4IDIwMjEiLCJpZCI6IjYwYjFjNDkyNGFiMjkzZGU5NjFkYTBlNyIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiY2ZhYnJpY2E0NiIsInV1aWQiOiI3OWVhOGVjNi0xMmNhLTRjZjktYmFjYi0zOTBkODI4Yzg0YjEifQ.82ZvIygphY_-rzdk_nEF48ZOgfhwhxWzIXTRNU8cnTU"

#Show User's Posts
#curl -X GET http://localhost:8080/user/posts -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTYXQgTWF5IDI5IDEwOjE0OjI4IDIwMjEiLCJpZCI6IjYwYjFjNDkyNGFiMjkzZGU5NjFkYTBlNyIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiY2ZhYnJpY2E0NiIsInV1aWQiOiI3OWVhOGVjNi0xMmNhLTRjZjktYmFjYi0zOTBkODI4Yzg0YjEifQ.82ZvIygphY_-rzdk_nEF48ZOgfhwhxWzIXTRNU8cnTU"

#Show User's Friends
#curl -X GET http://localhost:8080/user/friends -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTYXQgTWF5IDI5IDEwOjE0OjI4IDIwMjEiLCJpZCI6IjYwYjFjNDkyNGFiMjkzZGU5NjFkYTBlNyIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiY2ZhYnJpY2E0NiIsInV1aWQiOiI3OWVhOGVjNi0xMmNhLTRjZjktYmFjYi0zOTBkODI4Yzg0YjEifQ.82ZvIygphY_-rzdk_nEF48ZOgfhwhxWzIXTRNU8cnTU"

#Show Friend's Post
#curl -X GET http://localhost:8080/user/friend/posts -d '{"id":"60b1c4924ab293de961da0e8"}' -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTYXQgTWF5IDI5IDEwOjE0OjI4IDIwMjEiLCJpZCI6IjYwYjFjNDkyNGFiMjkzZGU5NjFkYTBlNyIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiY2ZhYnJpY2E0NiIsInV1aWQiOiI3OWVhOGVjNi0xMmNhLTRjZjktYmFjYi0zOTBkODI4Yzg0YjEifQ.82ZvIygphY_-rzdk_nEF48ZOgfhwhxWzIXTRNU8cnTU"

#Show All Friends' Posts
#curl -X GET http://localhost:8080/user/friends/posts -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTYXQgTWF5IDI5IDEwOjE0OjI4IDIwMjEiLCJpZCI6IjYwYjFjNDkyNGFiMjkzZGU5NjFkYTBlNyIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiY2ZhYnJpY2E0NiIsInV1aWQiOiI3OWVhOGVjNi0xMmNhLTRjZjktYmFjYi0zOTBkODI4Yzg0YjEifQ.82ZvIygphY_-rzdk_nEF48ZOgfhwhxWzIXTRNU8cnTU"
