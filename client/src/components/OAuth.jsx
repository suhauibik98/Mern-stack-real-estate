import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const Auth = getAuth(app);
      const result = await signInWithPopup(Auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
    });
    
      const data = await res.json();
      dispatch(signInSuccess(data));
      console.log(data);
      navigate("/")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-75"
      onClick={handleOAuth}
    >
      Continue with google
    </button>
  );
};
