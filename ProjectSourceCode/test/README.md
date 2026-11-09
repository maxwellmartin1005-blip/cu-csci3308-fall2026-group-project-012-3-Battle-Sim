### POST /register
Request: JSON containing username and password
Valid username:	A nonempty string
Valid password:	A string
Success: 201 and {"message":"Registration successful"}
Missing password	400 and {"message":"Invalid input"}
Persistence	One row in users; password stores a bcrypt hash