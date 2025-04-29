# Project Brief: tutorial1DAM

## Project Overview
This is a tutorial web application for 1DAM (first-year module of Application Development), built with Node.js, Express, and Sequelize ORM. The application demonstrates a full-stack web development approach with both JSON API endpoints and server-rendered EJS views.

## Core Components
- **Backend**: Express.js server with REST API endpoints
- **Database**: MySQL with Sequelize ORM
- **Frontend**: EJS templating for server-rendered views
- **Data Models**: Motorcycles and Categories
- **Docker**: Containerization setup with docker-compose

## Key Features
- CRUD operations for motorcycles and categories
- Relationship management between categories and motorcycles
- Dual interfaces: JSON API and web interface with EJS
- Static file serving for images

## Technical Stack
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **View Engine**: EJS
- **Development Tools**: Nodemon
- **Containerization**: Docker & Docker Compose

## Project Structure
- **src/**: Main application code
  - **app.js**: Application entry point
  - **db.js**: Database connection
  - **models/**: Data models
  - **routes/**: API endpoints
  - **views/**: EJS templates
  - **public/**: Static files
- **.env**: Environment configuration
- **docker-compose.yml**: Container orchestration
- **Dockerfile**: Container image definition

## Project Goals
- Demonstrate MVC architecture
- Showcase database relationships
- Implement API endpoints and web interfaces
- Provide practical experience with full-stack JavaScript development 