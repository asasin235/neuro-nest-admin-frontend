# NeuroNest Admin Frontend

Vue 3 admin panel for NeuroNest Smart Home platform.

## Features

- **Dashboard**: Overview with statistics and recent orders
- **User Management**: Create, edit, delete users, change roles
- **Package Management**: Create, edit, delete packages with image upload
- **Order Management**: View all orders, update status, filter by status
- **Authentication**: Login with admin credentials

## Tech Stack

- Vue 3 (Composition API)
- Vite
- TypeScript
- Vue Router
- Pinia (state management)
- Element Plus (UI library)
- Axios (HTTP client)

## Environment Variables

Create a `.env` file:

```env
VITE_ADMIN_API_URL=http://localhost:4002/api
```

## Installation

```bash
npm install
```

## Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # Reusable components
├── router/       # Vue Router configuration
├── stores/       # Pinia stores
├── types/        # TypeScript type definitions
├── views/        # Page components
├── App.vue       # Root component
└── main.ts       # Entry point
```

## Pages

- `/login` - Login page (admin credentials required)
- `/` - Dashboard
- `/users` - User management
- `/packages` - Package management
- `/orders` - Order management

## Docker

Build and run with Docker:

```bash
docker build -t neuronest-admin-frontend .
docker run -p 4001:4001 neuronest-admin-frontend
```

## Access

- Frontend: http://localhost:4001
- Backend API: http://localhost:4002/api

## Default Admin Credentials

Use the seed endpoint on the main backend to create an admin user:
```bash
curl -X POST http://localhost:3001/api/auth/seed-admin
```

Default credentials:
- Email: admin@neuronest.house
- Password: admin123456
