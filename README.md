# SkillSync Backend

A simple skill exchange platform backend with MySQL database integration.

## Features

- User registration and authentication
- Skill management (teach/learn)
- User matching based on skills
- Connection requests between users
- Time credit system
- Session management

## Setup

1. Install MySQL and create database:
```bash
mysql -u root -p < schema.sql
```

2. Compile the project:
```bash
javac -cp ".:mysql-connector-j-8.0.33.jar" *.java */*.java
```

3. Run the demo:
```bash
java -cp ".:mysql-connector-j-8.0.33.jar" Main
```

## Database Configuration

Edit database connection in `database/DatabaseUtil.java` if needed:
- URL: `jdbc:mysql://localhost:3306/skillsync`
- Username: `root`
- Password: (empty by default)

## Project Structure

```
backend/
├── Main.java              # Main demo application
├── schema.sql             # Database schema
├── database/              # Database utilities
├── user/                  # User management
├── skill/                 # Skill management
├── auth/                  # Authentication
├── credit/                # Credit system
├── request/               # Connection requests
└── userskill/             # User-skill relationships
```

## Running the Demo

The `Main.java` file demonstrates:
1. User registration
2. Skill creation
3. Skill assignment to users
4. User matching
5. Connection requests
6. Credit transactions

## CLI Interface

A command-line interface for interacting with the backend without frontend:

### Build and Run CLI:
```bash
# Build CLI
./build-cli.sh

# Run CLI
java -cp ".:mysql-connector-j-8.0.33.jar" cli.MainCLI
```

### CLI Features:
- User registration and login
- Skill management (add/view)
- Profile viewing
- Time credits viewing
- Menu-driven interface

## Requirements

- Java 8+
- MySQL 8.0+
- MySQL Connector/J 8.0.33 (included)