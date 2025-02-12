# IMF Gadget API

A secure API for managing IMF's gadget inventory. This API provides endpoints for creating, reading, updating, and decommissioning gadgets, as well as initiating self-destruct sequences. The API is deployed on Render.com for reliable cloud hosting, with the PostgreSQL database running on AWS RDS for robust data persistence and high availability.

## Postman Collection

[Postman Documentation](https://www.postman.com/imf-phoenix-team/workspace/imf-phoenix-team-workspace/collection/40658875-1991cb62-f48c-415d-8c99-e6283636ce26?action=share&creator=40658875)

## Features

- Secure JWT Authentication
- Role-based access control (agent/admin)
- Gadget inventory management
- Automatic codename generation for new gadgets
- Mission success probability calculation
- Self-destruct sequence simulation
- Secure decommissioning system

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database named 'imf_gadgets'

4. Configure environment variables:
   - Create a .env with your database credentials and JWT secret

5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  ```json
  {
    "username": "agent.hunt",
    "password": "your-password",
    "role": "admin"  // Optional, defaults to "agent"
  }
  ```

- `POST /auth/login` - Login and get JWT token
  ```json
  {
    "username": "agent.hunt",
    "password": "your-password"
  }
  ```

- `GET /auth/me` - Get current user details
  - Requires Authentication

### Gadgets (All require Authentication)

- `GET /gadgets?status={status}` - Get all gadgets with mission success probabilities
  - Optional query to filter gadgets by their status
  - Accessible by all authenticated users

- `POST /gadgets` - Add a new gadget
  - Requires admin role
  - Body: `{ "name": "Gadget Name" }`

- `PATCH /gadgets/:id` - Update a gadget
  - Requires admin role
  - At least one of "name" or "status" is required
  - Body: `{ "name": "New Name", "status": "Available" }`

- `DELETE /gadgets/:id` - Decommission a gadget
  - Requires admin role

- `POST /gadgets/:id/self-destruct` - Initiate self-destruct sequence
  - Requires admin role
  - Returns a confirmation code

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints:

1. Register or login to get a JWT token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer your-token-here
   ```

## Roles and Permissions

- **Agent**
  - Can view gadgets
  - Cannot modify gadget inventory

- **Admin**
  - Full access to all endpoints
  - Can create, update, and decommission gadgets
  - Can initiate self-destruct sequences

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error 
