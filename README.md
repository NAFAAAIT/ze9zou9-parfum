# Ze9zou9 Parfum

Luxury MERN perfume e-commerce application for Algeria.

## Stack

- React, Vite, Tailwind CSS
- Express, MongoDB, Mongoose
- JWT administration and bcrypt password hashing

## Setup

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Copy `.env.example` to `server/.env` and configure `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`.

Start MongoDB or configure MongoDB Atlas, then run:

```bash
npm run seed
npm run create-admin
npm run dev
```

The storefront is available at `http://localhost:5173` and the API at `http://localhost:5000`.