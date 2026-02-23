# MERN Stack Project Documentation

This document provides a detailed, file-by-file explanation of the project's architecture, logic, and configuration.

For a visual step-by-step guide on how data moves through the app, see: **[DATA_FLOW.md](file:///c:/Users/As123/Desktop/LPU-MERN/React/toast/DATA_FLOW.md)**

## 🏗️ Architecture Overview

The project follows a classic MERN (MongoDB, Express, React, Node.js) stack architecture, decoupled into two main directories:

- **`backend/`**: A RESTful API server handling authentication, database interactions, and business logic.
- **`frontend/`**: A Single Page Application (SPA) built with React and Redux Toolkit for state management.

---

## 🖥️ Backend Documentation

### `server.js`

The entry point of the backend application.

- **Environment Config**: Uses `dotenv` to load variables from `.env`. It uses `path` and `fileURLToPath` to ensure the correct path to `.env` is resolved regardless of where the process is started.
- **Middleware**:
  - `cors()`: Configured in "relaxed" mode (`origin: true`) to allow the frontend (on any port like 5173 or 5174) to communicate with the API.
  - `express.json()`: Parses incoming JSON request bodies.
- **Routing**: Registers `authRoutes` under the `/api/auth` prefix.
- **Database Connection**:
  - Implements a robust `startServer` function.
  - It first tries to connect to MongoDB Atlas (`MONGO_URI`).
  - If Atlas is unavailable (e.g., due to IP whitelisting or network issues), it **automatically falls back** to a local MongoDB instance (`LOCAL_MONGO_URI`).
- **Health Checks**: Includes a root `/` route and a Chrome DevTools specific route to reduce console noise.

### `routes/authRoutes.js`

Handles all authentication-related endpoints.

- **Signup (`POST /signup`)**:
  1. Extracts `name`, `email`, and `password` from the request body.
  2. Checks if a user already exists with that email using `User.findOne`.
  3. Hashes the password using `bcrypt` (10 salt rounds) for security.
  4. Creates the user record in MongoDB.
- **Login (`POST /login`)**:
  1. Finds the user by email.
  2. Compares the provided plain-text password with the hashed password in the DB using `bcrypt.compare`.
  3. If valid, signs a JSON Web Token (JWT) using `jwt.sign` with a secret key.
  4. Returns the `token` and `user` object to the client.

### `models/User.js`

The Mongoose schema defining the database structure.

- **Fields**: `name` (String), `email` (Unique String), `password` (Hashed String).
- **Timestamps**: Automatically adds `createdAt` and `updatedAt` fields to every user document.

### `.env`

Stores sensitive configuration.

- `PORT`: The port the server runs on (e.g., 5000).
- `MONGO_URI`: The MongoDB Atlas connection string.
- `LOCAL_MONGO_URI`: Fallback connection string for local development.
- `JWT_SECRET`: A string used to sign and verify JWT tokens.

---

## 🎨 Frontend Documentation

### `main.jsx`

The entry point of the React application.

- Wraps the `<App />` component in the Redux `<Provider store={store}>` to provide global state access to all components.

### `App.jsx`

The main UI and routing shell.

- **Routing**: Uses `react-router-dom` (`BrowserRouter`, `Routes`, `Route`) to handle navigation.
- **Toaster**: Includes the `<Toaster />` component from `react-hot-toast` for global notification display.
- **Dashboard Component**: A simple view shown after login that displays the user's name from the Redux state and provides a Logout button. The logout button dispatches the `logout` action and redirects to `/login`.

### `store/store.js`

The central state container.

- Configures the Redux store using `configureStore`.
- Registers the `auth` reducer from `authSlice.js`.

### `store/slices/authSlice.js`

The core of the application's business logic.

- **Persistence Layer**:
  - `loadStoredAuth()`: On app load, checks `localStorage` for any existing login session.
  - `persistAuth()`: Saves the user and token to `localStorage` whenever a successful login occurs.
- **Async Thunks**:
  - `signupUser`: Dispatches a `POST` request to `/auth/signup`. Triggers success/error toasts based on the response.
  - `loginUser`: Dispatches a `POST` request to `/auth/login`. On success, it updates the state with the user/token and persists them to `localStorage`.
- **Reducers**:
  - `logout`: Clears the state and removes the session from `localStorage`.

### `api/axios.js`

The API client configuration.

- Creates an Axios instance with a `baseURL` sourced from `import.meta.env.VITE_API_URL`.
- Sets `withCredentials: true` to ensure cookies/sessions (if used) are passed correctly.

### `pages/Signup.jsx` & `Login.jsx`

- **State Management**: Use local React `useState` for form fields.
- **Redux Integration**: Use `useDispatch` to trigger auth thunks and `useSelector` to check `isLoading` state (to disable buttons during requests).
- **Navigation**: Uses `useNavigate` to programmatically redirect users after successful actions.

### `utils/toast.js`

A utility wrapper for `react-hot-toast` that provides consistent icons and styling for `showInfo`, `showSuccess`, and `showError` notifications.

---

## ⚙️ Environment Setup

### Backend (.env)

```env
PORT=5000
MONGO_URI="your_mongodb_atlas_uri"
JWT_SECRET="your_secret_key"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```
