#!/bin/bash

#Signin
curl -X POST http://localhost:8080/api/v1/signin -d '{"username":"cfabrica46","password":"01234"}'

#SignUp
#curl -X POST http://localhost:8080/api/v1/signup -d '{"username":"cfabrica4","password":"789"}'

#Profile
curl -X GET http://localhost:8080/api/v1/user -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTdW4gSnVuIDIwIDIyOjM1OjExIDIwMjEiLCJpZCI6MSwicm9sZSI6Im1lbWJlciIsInVzZXJuYW1lIjoiIiwidXVpZCI6ImMwZDMzMTUxLTc1YmYtNDRmNi1hYjFhLTcwNDdhODRhMDZkMSJ9.tIb3_LlBTKirWbLjdYPac-xFNgabmNQovtTpeJIC44c"

#ShowUsers
#curl -X GET http://localhost:8080/users

#Delete

#Update
#curl -X PUT http://localhost:8080/user -d '{"username":"uwu","password":"owo"}' -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTdW4gSnVuIDIwIDIyOjI4OjA5IDIwMjEiLCJpZCI6MSwicm9sZSI6Im1lbWJlciIsInVzZXJuYW1lIjoiIiwidXVpZCI6ImU1OWJlYjA2LTI3ODctNDEwMi1hOTBjLTNiM2ZjMzgzYTc5YSJ9.XRA93798N0S1WeRMLJhKPJ5Jttdn2MhSExEo0fc8uF4"

#Show User's Posts
#curl -X GET http://localhost:8080/user/posts -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTdW4gSnVuIDIwIDIyOjI4OjA5IDIwMjEiLCJpZCI6MSwicm9sZSI6Im1lbWJlciIsInVzZXJuYW1lIjoiIiwidXVpZCI6ImU1OWJlYjA2LTI3ODctNDEwMi1hOTBjLTNiM2ZjMzgzYTc5YSJ9.XRA93798N0S1WeRMLJhKPJ5Jttdn2MhSExEo0fc8uF4"

#Show User's Friends
#curl -X GET http://localhost:8080/user/friends -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTdW4gSnVuIDIwIDIyOjI4OjA5IDIwMjEiLCJpZCI6MSwicm9sZSI6Im1lbWJlciIsInVzZXJuYW1lIjoiIiwidXVpZCI6ImU1OWJlYjA2LTI3ODctNDEwMi1hOTBjLTNiM2ZjMzgzYTc5YSJ9.XRA93798N0S1WeRMLJhKPJ5Jttdn2MhSExEo0fc8uF4"

#Show Friend's Post
#curl -X GET http://localhost:8080/user/friend/posts -d '{"id":"60b1c4924ab293de961da0e8"}' -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTdW4gSnVuIDIwIDIyOjI4OjA5IDIwMjEiLCJpZCI6MSwicm9sZSI6Im1lbWJlciIsInVzZXJuYW1lIjoiIiwidXVpZCI6ImU1OWJlYjA2LTI3ODctNDEwMi1hOTBjLTNiM2ZjMzgzYTc5YSJ9.XRA93798N0S1WeRMLJhKPJ5Jttdn2MhSExEo0fc8uF4"

#Show All Friends' Posts
#curl -X GET http://localhost:8080/user/friends/posts -H "Authorization-header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFkLWxpbmUiOiJTdW4gSnVuIDIwIDIyOjI4OjA5IDIwMjEiLCJpZCI6MSwicm9sZSI6Im1lbWJlciIsInVzZXJuYW1lIjoiIiwidXVpZCI6ImU1OWJlYjA2LTI3ODctNDEwMi1hOTBjLTNiM2ZjMzgzYTc5YSJ9.XRA93798N0S1WeRMLJhKPJ5Jttdn2MhSExEo0fc8uF4"
