import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";

const PublicRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-green-700">Checking access...</p>
      </div>
    );
  };
  return !user ? children : <Navigate to="/" />;
};

export default PublicRoute;
