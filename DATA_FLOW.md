# System Data Flow Documentation

This document explains exactly how data moves through your MERN application during different user actions.

---

## 1. 📝 Signup Data Flow

The process of creating a new account.

```mermaid
sequenceDiagram
    participant User
    participant SignupPage as Signup.jsx (React)
    participant AuthSlice as authSlice.js (Redux)
    participant API as server.js/authRoutes (Express)
    participant DB as MongoDB (User Model)

    User->>SignupPage: Fills form & clicks "Signup"
    SignupPage->>AuthSlice: Dispatch signupUser(formData)
    AuthSlice->>API: axios.post("/auth/signup", formData)
    API->>DB: User.findOne({ email }) - Check Existence
    DB-->>API: No user found
    API->>API: bcrypt.hash(password)
    API->>DB: User.create({ name, email, hashedPassword })
    DB-->>API: User Saved Successfully
    API-->>AuthSlice: 201 Success Response
    AuthSlice->>AuthSlice: Update isLoading: false
    AuthSlice-->>SignupPage: signupUser.fulfilled
    SignupPage->>User: Redirect to /login
```

---

## 2. 🔑 Login Data Flow

The process of verifying credentials and starting a session.

```mermaid
sequenceDiagram
    participant User
    participant LoginPage as Login.jsx (React)
    participant AuthSlice as authSlice.js (Redux)
    participant API as server.js/authRoutes (Express)
    participant DB as MongoDB (User Model)

    User->>LoginPage: Fills form & clicks "Login"
    LoginPage->>AuthSlice: Dispatch loginUser(formData)
    AuthSlice->>API: axios.post("/auth/login", formData)
    API->>DB: User.findOne({ email })
    DB-->>API: Return User Data (with Hashed Password)
    API->>API: bcrypt.compare(inputPassword, hashedDBPassword)
    API->>API: jwt.sign({ id: user._id }, JWT_SECRET)
    API-->>AuthSlice: Return { user, token }
    AuthSlice->>AuthSlice: Update State (user, token)
    AuthSlice->>AuthSlice: persistAuth() (Save to localStorage)
    AuthSlice-->>LoginPage: loginUser.fulfilled
    LoginPage->>User: Redirect to /dashboard
```

---

## 3. 🔄 Page Reload & Persistence

How the app remembers you when you close and reopen the tab.

```mermaid
graph TD
    A[Browser Reload / main.jsx Entry] --> B[authSlice.js Initialization]
    B --> C{Call loadStoredAuth}
    C -->|Has Data| D[Read JSON from localStorage 'authState']
    C -->|No Data| E[Initial State: user: null, token: null]
    D --> F[Set Initial State with stored User & Token]
    F --> G[App renders Dashboard if data exists]
    E --> H[App redirects to /login]
```

---

## 4. 🗄️ Database Fallback Logic (The "Smart" Connection)

How the backend manages connection failures automatically.

1.  **Stage 1 (Primary)**: The server tries to connect to `process.env.MONGO_URI` (MongoDB Atlas).
2.  **Timeout Setting**: We give it 8 seconds (`serverSelectionTimeoutMS: 8000`) to find the server.
3.  **Error Catch**: If it fails (e.g., your IP isn't whitelisted), it catches the error.
4.  **Stage 2 (Secondary)**: It prints a warning: "Atlas unavailable. Falling back to local...".
5.  **Local Connection**: It tries to connect to `mongodb://127.0.0.1:27017/toastdb`.
6.  **Success**: If local MongoDB is running, the server starts and works perfectly on your machine.

---

## 📂 Key File Responsibilities (Summary)

| File            | Role             | Responsibility                                            |
| :-------------- | :--------------- | :-------------------------------------------------------- |
| `server.js`     | **Orchestrator** | Starts the server, connects to DB, sets up CORS.          |
| `authRoutes.js` | **Guard**        | Logic for Sign-up checks, Password hashing, JWT signing.  |
| `User.js`       | **blueprint**    | Defines how a User looks in the database.                 |
| `authSlice.js`  | **Brain**        | Manages Auth state (loading, error, user) and calls APIs. |
| `axios.js`      | **Messenger**    | Pre-configured API client to talk to the backend.         |
| `App.jsx`       | **Router**       | Controls which page shows up depending on the URL.        |
