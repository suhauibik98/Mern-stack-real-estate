import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { OAuth } from "../../components/OAuth";
import { useLoginMutation } from "../../redux/apis/AuthApi";
import Spinner from "../../components/Spinner";
import PopUpMessages from "../../components/popup/PopUpMasseges";

function SignIn() {
  const [formData, setForm] = useState({});
  const [popupMessage, setPopupMessage] = useState({ message: "", code: "" });

  const [login, { isLoading, isError }] = useLoginMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { Loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopupMessage({ message: "", code: "" })
    try {
      dispatch(signInStart());
      const res = await login(formData).unwrap();
      
      dispatch(signInSuccess({ token: res.token, currentUser: res.user }));
      // localStorage.setItem("token", JSON.stringify(res.token));
      nav("/");
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.data.message || "Login failed"));
      setPopupMessage({ message: error.data?.message || "Login failed", code: error.status });
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // if (isLoading) return <Spinner />;

  return (
    <>
      {popupMessage.message !== "" && <PopUpMessages message={popupMessage.message} code={popupMessage.code} />}

      {/* Background with a real estate theme */}
      <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-900"
        style={{
          backgroundImage: "url('../../public/images/hero-image.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        {/* Motion Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative m-10 md:m-0 w-full max-w-md bg-white shadow-2xl rounded-lg p-8"
        >
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.input
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              type="text"
              placeholder="Email"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
              id="email"
              onChange={handleChange}
            />
            <motion.input
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg outline-none"
              id="password"
              onChange={handleChange}
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              disabled={Loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-all hover:bg-blue-700 disabled:bg-gray-400"
            >
              {Loading ? "Signing In..." : "Sign In"}
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
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </motion.div>
      </div>
    </>
  );
}

export default SignIn;
