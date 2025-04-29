# Technical Context

## Technology Stack
The project is built using the following technologies:

### Core Technologies
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework for Node.js
- **MySQL**: Relational database management system
- **Sequelize**: Promise-based Node.js ORM for MySQL
- **EJS**: Embedded JavaScript templating for server-rendered views

### Dependencies
```json
"dependencies": {
  "dotenv": "^16.4.7",     // Environment variable management
  "ejs": "^3.1.10",        // Templating engine
  "express": "^4.21.2",    // Web framework
  "mysql2": "^3.12.0",     // MySQL client for Node.js
  "sequelize": "^6.37.5"   // ORM for database interactions
},
"devDependencies": {
  "nodemon": "^3.1.9"      // Auto-restart server during development
}
```

## Development Environment
- **Node.js**: Development runtime
- **npm**: Package management
- **nodemon**: Development server with hot reload
- **Docker**: Containerization for consistent environment
- **Docker Compose**: Multi-container orchestration

## Database Configuration
The project uses MySQL with Sequelize ORM. Connection configuration is managed through environment variables:

```javascript
// src/db.js
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  }
);
```

Environment variables (`.env`):
- `MYSQL_HOST`: Database host
- `MYSQL_USER`: Database user
- `MYSQL_PASSWORD`: Database password
- `MYSQL_DATABASE`: Database name
- `PORT`: Application port (defaults to 3000)

## Running the Application
The application can be run in two primary ways:

### Development Mode
```bash
npm run dev
```
This uses nodemon to run the server with auto-restart on file changes.

### Container Mode
```bash
docker-compose up
```
This starts both the application and MySQL database in Docker containers.

## Data Models
The application has two primary data models:

### Category
```javascript
const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
```

### Motorcycle
```javascript
const Motorcycle = sequelize.define('Motorcycle', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cc: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
```

## API Endpoints
The application provides RESTful API endpoints for both Categories and Motorcycles:

- `/api/categories`: CRUD operations for categories
- `/api/motorcycles`: CRUD operations for motorcycles

## Web Interface
The application also provides a web interface using EJS templates:

- `/categories`: Web interface for categories
- `/motorcycles`: Web interface for motorcycles

## Technical Constraints
- MySQL as the database (not designed for other databases)
- Node.js environment required
- Docker for containerization
- Environment variables for configuration 