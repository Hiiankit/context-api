import { Toaster } from "react-hot-toast";
import useUsers from "./hooks/useUsers";
import { useState } from "react";

export default function App() {
  const {users,isLoading} = useUsers();

  return (
    <div style={{ padding: 40 }}>
      <Toaster position="top-right" />
      <h1>Axios + Toast Demo</h1>
      <h3>User List:</h3>

    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    )}

      
    </div>
  );
}