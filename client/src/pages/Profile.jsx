import { useRef, useState } from "react";
import { useSelector } from "react-redux";

// import React from 'react'

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
const [file , setFile] = useState(undefined)

console.log(file);

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4">
          <input type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden accept="image/*"/>
          <img
            className="rounded-full w-20 h-20 object-cover cursor-pointer self-center mt-2"
            src={currentUser.avatar}
            alt="profile"
            onClick={()=>fileRef.current.click()}
          />
          <input
            type="text"
            id="username"
            placeholder="username"
            className="border p-3 rounded-lg"
            value={currentUser.username}
          />
          <input
            type="email"
            id="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            value={currentUser.email}
          />
          <input
            type="text"
            id="password"
            placeholder="password"
            className="border p-3 rounded-lg"
          />

          <button className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
            update
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <span className="text-red-600">Delete account</span>
          <span className="text-red-600">Sign out</span>
        </div>
      </div>
    </>
  );
}
export default Profile;
