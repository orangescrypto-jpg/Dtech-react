import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { LogIn, LogOut, Loader2 } from "lucide-react";

const provider = new GoogleAuthProvider();

export default function AdminGuard({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Google Login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check console.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="section-container py-32 flex justify-center">
        <Loader2 className="animate-spin text-brand-blue w-10 h-10" />
      </div>
    );
  }

  // If NOT logged in, show Google Button
  if (!user) {
    return (
      <div className="section-container py-32 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-brand-gray mb-8 max-w-md">You must be authorized to create posts. Please sign in with your approved Google account.</p>
        <button onClick={handleLogin} className="btn-primary flex items-center gap-2">
          <LogIn size={20} /> Sign in with Google
        </button>
      </div>
    );
  }

  // If logged in, show dashboard
  return (
    <div>
      <div className="bg-brand-dark text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 section-container mx-auto w-full">
          <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium hidden sm:inline">Logged in as {user.displayName}</span>
          <button onClick={handleLogout} className="ml-auto flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
