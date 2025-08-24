import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful");
      navigate("/chat");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-purple-300">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Signup</h2>
        <div className="space-y-4">
          <input 
          type="text"
          placeholder="name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium shadow-md hover:bg-blue-600 transition-transform trasnform hover:scale-[1.02]"
        >
          Signup
        </button>
        <p className="text-sm text-center text-gray-500">
      Already have an account?{" "}
      <a href="/login" className="text-blue-500 font-medium hover:underline">
        Signin
      </a>
    </p>
      </form>
    </div>
  );
}
