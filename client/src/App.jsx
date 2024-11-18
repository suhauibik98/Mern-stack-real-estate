import "../src/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Home  from "./pages/Home";
import  About  from "./pages/About";
import  SignIn  from "./pages/SignIn";
import  SignUp  from "./pages/SignUp";
import  Profile  from "./pages/Profile";
import { Header } from "./components/Header";
import Prodector from "./components/Prodector";
import  CreateListing  from "./pages/CreateListing";
import { CardDetails } from "./components/CardDeitails";
import UpdateListing from "./pages/UpdateListing";
function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Prodector><Home /></Prodector>  } />
        <Route path="/about" element={<Prodector><About /></Prodector>} />
        <Route path="/profile" element={<Prodector><Profile /></Prodector>} />

        <Route path="/create-listing" element={<Prodector><CreateListing></CreateListing></Prodector>}/>
        <Route path="/card-ditails/:cardId" element={<Prodector><CardDetails></CardDetails></Prodector>}/>
        <Route path="/card-update/:cardId" element={<Prodector><UpdateListing></UpdateListing></Prodector>}/>
      
        
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
