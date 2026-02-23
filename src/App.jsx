import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchUsers } from "./store/slices/appSlice";

export default function App() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div style={{ padding: 40 }}>
      <Toaster position="top-right" />
      <h1>Axios + Redux + Toast Demo</h1>

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