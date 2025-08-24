import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-purple-300">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center w-96">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h1>
        <p className="text-gray-600 mb-8">
          Please login or signup to continue
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="w-full px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
