# IMF Gadget API

A secure API for managing IMF's gadget inventory. This API provides endpoints for creating, reading, updating, and decommissioning gadgets, as well as initiating self-destruct sequences.

## Features

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
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`

5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Gadgets

- `GET /gadgets` - Get all gadgets with mission success probabilities
- `POST /gadgets` - Add a new gadget
  - Body: `{ "name": "Gadget Name" }`
- `PATCH /gadgets/:id` - Update a gadget
  - Body: `{ "name": "New Name", "status": "Available" }`
- `DELETE /gadgets/:id` - Decommission a gadget

### Self-Destruct

- `POST /gadgets/:id/self-destruct` - Initiate self-destruct sequence
  - Returns a confirmation code

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error 