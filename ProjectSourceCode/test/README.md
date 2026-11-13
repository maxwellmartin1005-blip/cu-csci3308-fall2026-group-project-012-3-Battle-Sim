### POST /register
Request: JSON containing username and password
Valid username:	A nonempty string
Valid password:	A string
Success: Redirect to /login
Missing password: Stay on /register and show an error
Persistence: One row in users; password stores a bcrypt hash

Login tests use unique usernames/emails, insert bcrypt-hashed fixtures, and delete only their own users afterward. Set NODE_ENV=test and POSTGRES_DB to an isolated name ending in _test before running npm test. The application and tests now share ProjectSourceCode/db.js so the existing root cleanup hook closes the application pool too. Login returns 400 for missing/malformed fields, 401 for incorrect credentials, 500 for a database failure, and redirects valid credentials to /home with a regenerated session.

Sessions use the existing express-session memory store for local development and end when the server restarts. Set SESSION_SECRET in the local environment to a private random value (at least 32 bytes). Without it, a fresh random secret is generated per process. Production requires HTTPS for secure cookies and a persistent session store before deployment. GET /home redirects signed-out requests to /login; POST /logout destroys the session and clears battle.sid. Play remains a disabled placeholder from #48.

Character creation step 1: signed-in users can check a name (1-255 characters), one of six elements, at least one real move ID, and a PNG/JPEG image up to 2 MB. The server uses sharp to decode PNG/JPEG pixels, checks the actual format against the declared type, and rejects unreadable or truncated files. POST /createFighter returns 400 for invalid fields/uploads or 200 for a valid preview; it does not save fighters yet. Form tests create unique disposable user/move fixtures and assert that checking valid details inserts no fighter. No maximum move count is assumed while the team requirement is TBD.
