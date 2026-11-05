# Battle Sim

## Project Overview

Battle Sim is a turn based battle simulator where you use the moves of the people that we put into the game, and simulate battles against you, your friends, and others.

## Team Information

- **Course:** CSCI 3308 - Software Development Methods and Tools
- **Team Number:** 012-3
- **Team Name:** Team Avatar

### Team Members

| Name | Email | GitHub Username |
|------------|------------------------|---------------------|
| Max Martin | Max.Martin-2@colorado.edu | maxwellmartin1005-blip |
| Jamie Grove | Jamie.Grove@colorado.edu | jamiegrove76-pixel |
| Aidan Johnson | Aidan.Johnson-2@colorado.edu | Aidan-dev50 |
| Andre Kalberer | Andre.Kalberer@colorado.edu | AndreKalberer |
| Zander Trafton-Hancock | Zander.Trafton-Hancock@colorado.edu |ZandadaPanda96 |
| Yuan Zuo | Yuan.Zuo@colorado.edu | yuanzuo09 |

## Technology Stack

Will be updated as time goes on.
| Technology | Purpose |
|---|---|
| HTML | Structures the web pages. |
| CSS | Styles the application's user interface. |
| JavaScript | Implements client-side and server-side functionality. |
| Node.js | Runs the application server. |
| Express.js | Handles HTTP requests, routes, and communication between the interface and database. |
| Handlebars | Generates dynamic HTML pages using templates. |
| PostgreSQL | Stores user information and application data. |

## Prerequisites

Will be updated as time goes on.

Before running the application locally, install the following software:

- **Git:** To clone the repository.
- **Docker Desktop or Docker Engine:** To run the application containers.
- **Docker Compose:** To start and manage the application services.
- **A web browser:** To access the application.
- **Node.js and npm:** Needed if running the application or tests directly on the host machine rather than inside Docker.


## Running the Application Locally

Follow these steps to run the application on your local machine.

### Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone git@github.com:ZandadaPanda96/cu-csci3308-fall2026-group-project-012-3-Battle-Sim.git
```

Navigate into the cloned repository:

```bash
cd cu-csci3308-fall2026-group-project-012-3-Battle-Sim
```

### Step 2: Navigate to the Source Code Directory

```bash
cd ProjectSourceCode
```

### Step 3: Configure Environment Variables

Make an env file resembling this:

POSTGRES_USER="postgres"
POSTGRES_PASSWORD=<password_here>
POSTGRES_DB=<db_name_here>

### Step 4: Start the Application

run "npm start", Docker Compose: TODO

### Step 5: Access the Application

Open your web browser and navigate to:

```text
http://localhost:3000
```

This address assumes the application maps port `3000` from the container to port `3000` on your machine.

### Step 6: Stop the Application

Docker Compose: TODO

### Troubleshooting

Docker: TODO

- Confirm that the database initialization scripts run successfully.

## 6. Running Tests

The project includes automated tests to verify that the application's server and functionality behave as expected.

### Install Dependencies

If running tests directly on your machine, navigate to `ProjectSourceCode/` and run:

```bash
npm install
```

### Run the Test Suite

If the project's `package.json` defines a test script, run:

```bash
npm test
```

### Test Coverage


Will be updated as time goes on.

The test suite should verify functionality such as:

- User registration and input validation.
- User login and authentication.
- Session creation and logout.
- Communication between the server and database.
- Application-specific API endpoints.
- Appropriate responses to invalid requests.

**Note:** The commands above assume a test script is configured in `package.json`. Replace them with the actual test commands used by the project.
