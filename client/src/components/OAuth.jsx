import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useGoogleAuthMutation } from "../redux/apis/AuthApi";
import { useEffect } from "react";

export const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleAuthMutation();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // 📌 تسجيل الدخول باستخدام إعادة التوجيه
  const handleOAuth = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("OAuth Error:", error);
    }
  };

  // 📌 استرجاع نتيجة تسجيل الدخول بعد إعادة التوجيه
  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const formData = {
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
            phone: result.user.phoneNumber || "0790000000"
          };
          const data = await googleAuth(formData).unwrap();
          dispatch(signInSuccess({ token: data.token, currentUser: data.user }));
          navigate("/");
        }
      } catch (error) {
        console.error("Redirect Error:", error);
      }
    };

    fetchRedirectResult();
  }, [auth, dispatch, googleAuth, navigate]);

  return (
    <button
      type="button"
      className="flex w-full items-center justify-center border border-gray-400 rounded-lg p-3 hover:bg-gray-100 transition duration-300"
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
