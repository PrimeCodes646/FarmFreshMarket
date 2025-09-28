# Farm Market Backend

A Node.js/Express backend for Farm Market with user, product, and order management.

## Setup
1. Install dependencies: `npm install`
2. Create a `.env` file (see sample)
3. Start server: `npm start`

## Structure
- config/db.js: MongoDB connection
- models/: Mongoose models
- routes/: Express routes
- controllers/: Route logic
- middleware/: Auth, roles, error handling
- utils/validators.js: Validation helpers
- uploads/: Image uploads
