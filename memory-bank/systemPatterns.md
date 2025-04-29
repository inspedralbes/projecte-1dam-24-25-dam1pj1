# System Patterns

## Architecture Overview
This project follows the Model-View-Controller (MVC) architectural pattern with clear separation of concerns:

1. **Models** (Sequelize): Data structure and database interactions
2. **Views** (EJS): Presentation layer for web interface
3. **Controllers** (Express Routes): Request handling and business logic

## Component Relationships
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Routes    │────▶│ Controllers │────▶│   Models    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       │
       │                                       ▼
       │                               ┌─────────────┐
       │                               │  Database   │
       ▼                               └─────────────┘
┌─────────────┐
│    Views    │
└─────────────┘
```

## Key Design Patterns

### Repository Pattern
- Models encapsulate data access logic
- Controllers use models to interact with data
- Separation between business logic and data access

### Dependency Injection
- Database connection injected into models
- Models injected into routes/controllers
- Promotes testability and loose coupling

### Route Separation
- API routes separate from web interface routes
- Clear distinction between JSON endpoints and EJS views
- Consistent route naming conventions

### Data Relationships
- One-to-many relationship between Categories and Motorcycles
- Foreign key constraints enforced at database level
- Cascade delete for maintaining data integrity

## Database Architecture
- Sequelize ORM for database interactions
- MySQL as the underlying database
- Models define schema and relationships
- Database configuration via environment variables

## File Organization
```
src/
├── app.js            # Application entry point
├── db.js             # Database connection
├── models/           # Data models
│   ├── Category.js   # Category model
│   └── Motorcycle.js # Motorcycle model
├── routes/           # API routes
│   ├── categories.routes.js      # Category API routes
│   ├── motorcycles.routes.js     # Motorcycle API routes 
│   ├── categoriesEJS.routes.js   # Category web routes
│   └── motorcyclesEJS.routes.js  # Motorcycle web routes
├── views/            # EJS templates
└── public/           # Static files
    └── images/       # Image storage
```

## Code Organization Principles
1. **Single Responsibility**: Each file handles one aspect of functionality
2. **Don't Repeat Yourself (DRY)**: Common code is extracted and reused
3. **Configuration over Convention**: Environment variables for configuration
4. **Explicit over Implicit**: Clear naming and predictable behavior 