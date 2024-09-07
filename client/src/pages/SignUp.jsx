import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OAuth } from "../components/OAuth";
function SignUp() {
  const [formData, setForm] = useState({});
  const [error, setError] = useState(null);
  const [Loading, setLoading] = useState(null);
  const nav = useNavigate();
  const handleChange = (e) => {
    setForm({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
          setError(data.message)
          setLoading(true)
          return;
        }
        
        if (res.status === 201) nav("/sign-in");
      } catch (err) {
        console.log("ERROR IN CATCH",err);
      }
      finally{
        setLoading(false)
        
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col  gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
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
        <button disabled={Loading} className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
          {Loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-1 mt-3">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-300 mt-5">{error}</p>}
    </div>
  );
}

export default SignUp;
