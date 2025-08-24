import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signin successful");
      navigate("/chat");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-purple-300">
  <form
    onSubmit={handleSignin}
    className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
    
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium shadow-md hover:bg-blue-600 transition-transform transform hover:scale-[1.02]"
    >
      Sign In
    </button>

    <p className="text-sm text-center text-gray-500">
      Don’t have an account?{" "}
      <a href="/signup" className="text-blue-500 font-medium hover:underline">
        Sign Up
      </a>
    </p>
  </form>
</div>

  );
}
