"use client";

import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations"; 
import { useAuthStore } from "../app/store/useAuthStore";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const loginStore = useAuthStore((state) => state.login);
  
  const [loginMutation, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const { data } = await loginMutation({
        variables: { email: "admin@example.com" }, // static for now
      });
      if (data?.login) {
        loginStore({email:data.login.email, id:data.login.id});
        onClose();
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Login</h2>

        {error && <p className="text-red-500">{error.message}</p>}

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button onClick={onClose} className="mt-2 w-full border py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
