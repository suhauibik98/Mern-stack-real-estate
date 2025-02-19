import { Link } from "react-router-dom";
import heroImage1 from "../../../public/images/es_main_7.jpg";
import {
  FaArrowRight,
  FaBuilding,
  FaCar,
  FaHome,
  FaHotel,
  FaConciergeBell,
} from "react-icons/fa";
import { useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div
        className="w-full bg-primary py-10 mb-10 flex items-center justify-center text-center"
        style={{
          background:
            "linear-gradient(rgba(20, 20, 31, 0.7), rgba(20, 20, 31, 0.7)), url('../../public/images/es_2.jpg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-4xl mb-2 md:text-5xl text-white font-bold animate-slideInDown">
              About Us
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="flex justify-center items-center space-x-2 text-white text-lg">
                <li className="breadcrumb-item">
                  <Link to="/" className="hover:text-primary-normal-hover">
                    Home
                  </Link>
                </li>
                <KeyboardArrowRightIcon fontSize="small" className="ml-4" />

                <li className="text-primary-normal active" aria-current="page">
                  About
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="">
        <div className="container p-4 mx-auto py-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative h-[400px] lg:h-auto rounded-lg overflow-hidden shadow-lg transform transition duration-500 ease-in-out">
              <img
                className="w-full h-full object-cover absolute"
                src={heroImage1} // Replace with your image URL
                alt="About Us"
              />
            </div>

            {/* Text Section */}
            <div className="space-y-6" data-wow-delay="0.3s">
              <h6 className="text-primary-normal px-3 inline-block uppercase font-bold text-xs md:text-lg py-1 ">
                About Us
              </h6>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight mb-6">
                Welcome to{" "}
                <span className="text-primary-normal">AK RealEstate</span>
              </h1>
              <p className="text-sm md:text-lg text-gray-600 mb-6">
                We provide premium real estate services with a range of
                properties, including luxury homes, apartments, and commercial
                spaces. Our mission is to help you find your dream property.
              </p>
              <p className="text-sm md:text-lg text-gray-600 mb-6">
                Whether you're looking to buy, sell, or rent, we offer
                personalized services to guide you every step of the way.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaHome className="mr-3" color="#86B822" /> Residential
                    Properties
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaBuilding className="mr-3" color="#86B822" /> Commercial
                    Properties
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaHotel className="mr-3" color="#86B822" /> Luxury Villas &
                    Apartments
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaCar className="mr-3" color="#86B822" /> Parking Space
                    Available
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaConciergeBell className="mr-3" color="#86B822" />{" "}
                    Concierge Services
                  </p>
                </div>
                <div>
                  <p className="mb-0 flex items-center text-sm md:text-base text-gray-700 hover:text-primary transition duration-300">
                    <FaArrowRight className="mr-3" color="#86B822" /> 24/7
                    Customer Support
                  </p>
                </div>
              </div>

              {/* <a
                href="#"
                className="inline-block text-sm py-1 px-3 md:text-base md:py-3 md:px-6 bg-primary-normal text-white font-semibold rounded-full shadow-md transition duration-300 ease-in-out transform hover:bg-primary-normal-hover"
              >
                Read More
              </a> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
