import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { OAuth } from "../../components/OAuth";
import { useSignupMutation } from "../../redux/apis/AuthApi";
import Spinner from "../../components/Spinner";

function SignUp() {
  const [formData, setForm] = useState({});
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const [signup, { isLoading, isError }] = useSignupMutation();

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      if (response?.error) {
        setError(response?.error?.data?.message);
        return;
      }
      nav("/sign-in");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('../../public/images/hero-image.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Motion Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white shadow-2xl rounded-lg p-8"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
            id="username"
            value={formData?.username}
            onChange={handleChange}
          />
          <motion.input
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
            id="email"
            value={formData?.email}
            onChange={handleChange}
          />
          <motion.input
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            type="phone"
            placeholder="Phone"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
            id="phone"
            value={formData?.phone}
            onChange={handleChange}
          />
          <motion.input
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
            id="password"
            value={formData?.password}
            onChange={handleChange}
          />
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            transition={{ duration: 0.5, delay: 0.8 }}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-all hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-500">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <OAuth />

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Have an account?{" "}
            <Link to="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </motion.div>
    </div>
  );
}

export default SignUp;
