# Support Ticket API

## Tech Stack
- Node.js
- Express
- MySQL
- JWT Authentication

## Setup Instructions

1. Clone the repo
2. Run: npm install
3. Create .env file:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=support_ticket_system
   JWT_SECRET=your_secret
4. Run: node server.js

## API Features
- Role-based access control (MANAGER, SUPPORT, USER)
- Ticket lifecycle enforcement
- Status logging
- Comment system with ownership validation