// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Buat konteks autentikasi
const AuthContext = createContext();

// Custom hook untuk akses AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider untuk membungkus aplikasi
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pantau perubahan autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email === "admin@example.com";
        setUser({
          email: firebaseUser.email,
          role: isAdmin ? "admin" : "user",
          isLoggedIn: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fungsi logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Kosongkan user setelah logout
    } catch (error) {
      console.error("Logout gagal:", error.message);
    }
  };

  // Tampilkan saat loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Memuat autentikasi...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
