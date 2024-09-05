import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

function SignIn() {
  const [formData, setForm] = useState({});
 
  const dispatch = useDispatch();
  const nav = useNavigate();
const {Loading , error } = useSelector(state=>state.user)
  const handleChange = (e) => {
    setForm({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      nav("/");
      // if(res.status === 200)
    } catch (err) {
      console.log(err, "catch");
        dispatch(signInFailure());
    }
    // } finally {
    // }
  };

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col  gap-4">
          {/* <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          /> */}
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={Loading}
            className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
          >
            {Loading ? "Loading..." : "Sign in"}
          </button>
        </form>
        <div className="flex gap-1 mt-3">
          <p>Dont Have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>
        {error && <p className="text-red-300 mt-5">{error}</p>}
      </div>
    </>
  );
}

export default SignIn;
