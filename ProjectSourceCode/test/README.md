### POST /register
Request: JSON containing username and password
Valid username:	A nonempty string
Valid password:	A string
Success: Redirect to /login
Missing password: Stay on /register and show an error
Persistence: One row in users; password stores a bcrypt hash

Login tests use unique usernames/emails, insert bcrypt-hashed fixtures, and delete only their own users afterward. Set NODE_ENV=test and POSTGRES_DB to an isolated name ending in _test before running npm test. The application and tests now share ProjectSourceCode/db.js so the existing root cleanup hook closes the application pool too. Login returns 400 for missing/malformed fields, 401 for incorrect credentials, 500 for a database failure, and redirects valid credentials to /home with a regenerated session.

Sessions use the existing express-session memory store for local development and end when the server restarts. Set SESSION_SECRET in the local environment to a private random value (at least 32 bytes). Without it, a fresh random secret is generated per process. Production requires HTTPS for secure cookies and a persistent session store before deployment. GET /home redirects signed-out requests to /login; POST /logout destroys the session and clears battle.sid. Home Play opens character selection for signed-in users.

Character creation: signed-in users submit a name (1-255 characters), a starter class, exactly four distinct allowed move IDs, and a readable PNG/JPEG image up to 2 MB. POST /createFighter validates and saves through saveFighter, then redirects to an ownership-checked GET confirmation. Invalid details return 400 with preserved text/selections; save failures return 500 with generic feedback and no partial records. Refreshing confirmation does not repeat the POST.

The server copies the selected starter class's six stats and element. Allowed moves are all moves matching that element plus the class's default moves, with each move listed once. Class changes autofill its defaults without changing the player's name or image. Form owner/stat/element values are ignored. Player-owned fighters cannot be used as classes, and original starter records are never modified.

Uploaded images are written to ProjectSourceCode/images with server-generated UUID filenames; fighters.image stores /images/<filename>.png or .jpg. The static route serves those URLs. A failed database transaction removes the new file. Runtime uploads are ignored by Git; starter images can be added deliberately.

Fresh databases use the TEXT image column and seven starter paths from init_data. For an existing BYTEA database, run migrations/001_fighter_image_paths.sql once with your normal database tooling. It converts nulls and UTF-8 paths, adds missing starter paths, and rolls back if binary image data cannot be converted; export such images to files before retrying. Do not reset an existing database to apply this change.

Saving and HTTP tests verify class stats and restrictions, unique image paths, served image contents, JPEG support, ownership, client-field tampering, confirmation refresh, and database/file rollback. Each test cleans up only its own records and files. Character selection now uses the merged PR #93 to display stored image paths. Migration tests use a temporary table and verify existing paths and rollback without changing application records.
