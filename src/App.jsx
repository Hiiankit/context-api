import { Toaster } from "react-hot-toast";
import useUsers from "./hooks/useUsers";

export default function App() {
  const { users, isLoading } = useUsers();

  return (
    <div style={{ padding: 40 }}>
      <Toaster position="top-right" />
      <h1>Axios + Toast + Loading Demo</h1>

      {isLoading ? (
        <p className="loadingState">Loading users List...</p>
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