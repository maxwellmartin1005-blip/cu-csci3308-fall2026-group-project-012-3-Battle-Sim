### POST /register
Request: JSON containing username and password
Valid username:	A nonempty string
Valid password:	A string
Success: Redirect to /login
Missing password: Stay on /register and show an error
Persistence: One row in users; password stores a bcrypt hash