import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="flex justify-between items-center bg-green-600 px-6 py-4 text-white">
      <h1 className="text-xl font-bold">EcoLocation</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={handleLogout} className="underline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
