import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignUp() {
  const [formData, setForm] = useState({});
  const nav = useNavigate()
  const handleChange = (e) => {
    setForm({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      })
      const data = await res.json()
      console.log(data);
      
if(res.status === 201)
   nav("/")


    }

    catch(err){console.log(err);
    }

    
    
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>

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
        <button
          
          className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
        >
          Sign up
        </button>
      </form>
      <div className="flex gap-1 mt-3">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
