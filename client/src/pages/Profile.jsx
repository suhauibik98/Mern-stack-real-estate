import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

// import React from 'react'

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUplod(file);
    }
  }, [file]);

  const handleFileUplod = (file) => {
    const storge = getStorage(app);
    const fileName = new Date().getTime() + "_" + file.name;
    const storageRef = ref(storge, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);

        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) =>
          setformData({ ...formData, avatar: downLoadURL })
        );
      }
    );
  };

  // fire base storge
  // allow read;
  // allow write:if
  // request.resource.size <2 *1024*1024 && request.resource.contentType.matches('image/.*')
  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileRef}
            hidden
            readOnly
            accept="image/*"
          />
          <img
            className="rounded-full w-20 h-20 object-cover cursor-pointer self-center mt-2"
            src={formData.avatar ||  currentUser.avatar}
            alt="profile"
            onClick={() => fileRef.current.click()}
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700"> Error Image Upload (image must be less 2 mb)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-500">{`Upload ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-400">Image successfuly upload</span>
            ):""}
          </p>
          <input
            type="text"
            id="username"
            placeholder="username"
            className="border p-3 rounded-lg"
            // value={currentUser.username}
          />
          <input
            type="email"
            id="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            // value={currentUser.email}
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
