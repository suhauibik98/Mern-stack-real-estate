import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import DeleteUser from "../components/DeleteUser";

// import React from 'react'

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [Popup, setPopup] = useState(false);
  const [formData, setformData] = useState({});
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUplod(file);
    }
  }, [file]);

  console.log(currentUser);

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
        // console.log("Upload is " + progress + "% done");
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

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      dispatch(updateSuccess(data));
      nav("/");
    } catch (error) {
      dispatch(updateFailure({ error: error.massage }));
      console.log(error);
    } finally {
      dispatch(updateFailure());
    }
  };
  const setToValueDeleted = () => {
    setPopup(true);
  };
  const callBackFun = (el) => {
    setPopup(el);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      dispatch(signOutSuccess(data));
    } catch (err) {
      // console.log(err)
      dispatch(signOutFailure(err));
    }
  };

  const renderPasswordFields = () => {
    if (currentUser.isGoogle) {
      return currentUser.isModifiedPassword ? (
        <>
          <input
            type="password"
            id="password"
            placeholder="Current password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            id="new_password"
            placeholder="New password"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
          />
        </>
      ) : (
        <input
          type="password"
          id="new_password"
          placeholder="Create new password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
      );
    } else {
      return (
        <>
          <input
            type="password"
            id="password"
            placeholder="Current password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            id="new_password"
            placeholder="New password"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
          />
        </>
      );
    }
  };
  // fire base storge
  // allow read;
  // allow write:if
  // request.resource.size <2 *1024*1024 && request.resource.contentType.matches('image/.*')
  return (
    <>
      {Popup && <DeleteUser></DeleteUser>}
      {loading && <Spinner></Spinner>}
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            onClick={() => fileRef.current.click()}
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image Upload (image must be less 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-500">{`Upload ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-400">Image successfuly upload</span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            id="username"
            placeholder="username"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            defaultValue={currentUser.username}
          />
          <input
            type="email"
            id="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            defaultValue={currentUser.email}
          />

          {/* {currentUser.isGoogle ? (
            currentUser.isModifiedPassword ? (
              <>
                <input
                  type="password"
                  id="password"
                  placeholder="current password"
                  className="border p-3 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  id="new_password"
                  placeholder="new password"
                  className="border p-3 rounded-lg mt-2"
                  onChange={handleChange}
                />
              </>
            ) : (
              <input
                type="password"
                id="new_password"
                placeholder="create new password"
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
            )
          ) : (
            <>
              <input
                type="password"
                id="password"
                placeholder="current password"
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
              <input
                type="password"
                id="new_password"
                placeholder="new password"
                className="border p-3 rounded-lg mt-2"
                onChange={handleChange}
              />
            </>
          )} */}
{renderPasswordFields()}
          {/* <input
            type="password"
            id={`${currentUser.isGoogle?"new_password":"password"}`}
            placeholder={`${currentUser.isGoogle?"create new password":"currunt password"}`}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

            {(currentUser.isGoogle && currentUser.isisModifiedPassword) && <input
            type="password"
            id="new_password"
            placeholder="new password"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />} */}

          <button className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
            {loading ? "update..." : "update"}
          </button>
          <Link
            to={"/create-listing"}
            className="bg-green-700 uppercase text-center text-white rounded-lg p-3 hover:opacity-95"
          >
            Create listing
          </Link>
        </form>
        <div className="flex justify-between mt-5">
          <button className="text-red-600" onClick={setToValueDeleted}>
            Delete account
          </button>
          <DeleteUser open={Popup} setOpen={callBackFun}></DeleteUser>
          <span
            className="text-red-600 hover:cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </span>
        </div>
        <p className="text-red-700 mt-4">{error ? error : ""}</p>
      </div>
    </>
  );
}
export default Profile;
