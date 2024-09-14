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
      navigate("/")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <button
    //   type="button"
    //   className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-75"
    //   onClick={handleOAuth}
    // >
    //   Continue with google
    // </button>
    <button
  type="button"
  className="flex items-center justify-center border border-gray-400 rounded-lg p-3 hover:bg-gray-100 transition duration-300"
  onClick={handleOAuth}
>
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png" 
    alt="Google logo" 
    className="w-5 h-5 mr-2"
  />
  <span className="text-gray-700 font-semibold">Google</span>
</button>

  );
};
