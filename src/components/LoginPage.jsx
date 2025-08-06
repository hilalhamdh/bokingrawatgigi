// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, auth } from "../firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Login gagal: " + err.message);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center py-16 px-4 flex items-center justify-center"
      style={{ backgroundImage: 'url("/bg.jpg")' }} // Ganti sesuai path background
    >
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-semibold text-center text-[#76BBDD] mb-6">
          Login Admin
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm 
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none 
             text-gray-700 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1 "
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm 
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none 
             text-gray-700 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#87CEEB] hover:bg-[#76BBDD] text-white py-2 rounded-md font-semibold transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
