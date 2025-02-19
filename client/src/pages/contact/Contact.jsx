import React, { useEffect, useState } from "react";
import { useContactMessageMutation } from "../../redux/apis/UserApi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const Contact = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [contactMessage] = useContactMessageMutation();
  const [contactFrom, setContactForm] = useState({
    name: currentUser?.username || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    message: "",
  });
  const handleSubmaitContactForm = async (e) => {
    e.preventDefault();
    // console.log(contactFrom);
    try {
      await contactMessage({ formData: contactFrom }).unwrap();
      // setContactForm({
      //   name: currentUser?.username || "",
      //   email: currentUser?.email || "",
      //   phone: currentUser?.phone || "",
      //   message: "",
      // });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChanged = (e) => {
    setContactForm({ ...contactFrom, [e.target.id]: e.target.value });
  };
  return (
    <>
      <div
        className="w-full bg-primary py-10  mb-10 flex items-center justify-center text-center"
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
              Contact Us
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="flex justify-center items-center space-x-2 text-white text-lg">
                <li className="breadcrumb-item">
                  <Link to="/" className="hover:text-primary-normal-hover">
                    Home
                  </Link>
                </li>
                <KeyboardArrowRightIcon fontSize="small" className="ml-4"/>
                <li className="text-primary-normal active" aria-current="page">
                  Contact
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 py-16">
        {/* Heading Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h6 className="text-primary-normal px-3 inline-block uppercase font-bold text-xs md:text-lg py-1">
            Get in Touch
          </h6>
          <h1 className="mb-5 text-2xl md:text-3xl lg:text-4xl font-extrabold">
            Contact Us Today
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-sm md:text-base lg:text-lg">
            Have questions about buying, selling, or renting properties? Our
            team is here to assist you every step of the way. Reach out to us
            for expert real estate advice and personalized service.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="container my-3 mx-auto px-5 lg:px-10 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            background:
              "linear-gradient(rgba(15, 23, 43, 0.7), rgba(15, 23, 43, 0.7)), url('../../../public/images/hero-image.jpg')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center py-8 bg-opacity-80">
            {/* Left Side - Contact Info */}
            <motion.div
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h6 className="uppercase text-xs md:text-lg font-semibold">
                Contact Us
              </h6>
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                Get In Touch
              </h1>
              <p className="text-xs md:text-base mb-4">
                Have questions about buying, selling, or renting properties? Our
                team is here to help. Contact us today and let’s find the
                perfect property for you.
              </p>
              <p className="text-xs md:text-base mb-4">
                We provide expert real estate services, from property listings
                to consultation and financing options.
              </p>

              <Link
                to={"/contact"}
                className="border text-xs py-2 px-4 md:py-3 md:px-6 md:text-base border-white text-white  rounded-lg inline-block hover:bg-[#ffffff3b] transition"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              className="bg-white p-6 md:p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h1 className="text-primary text-lg md:text-2xl font-bold mb-4">
                Send Us A Message
              </h1>
              <form onSubmit={handleSubmaitContactForm}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium text-sm md:text-base">
                      Your Name
                    </label>
                    <input
                      required
                      onChange={(e) => handleChanged(e)}
                      value={contactFrom.name}
                      id="name"
                      type="text"
                      className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium text-sm md:text-base">
                      Your Email
                    </label>
                    <input
                      required
                      onChange={(e) => handleChanged(e)}
                      value={contactFrom.email}
                      id="email"
                      type="email"
                      className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 font-medium text-sm md:text-base">
                    Phone Number
                  </label>
                  <input
                    onChange={(e) => handleChanged(e)}
                    value={contactFrom.phone}
                    id="phone"
                    type="number"
                    className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-gray-700 font-medium text-sm md:text-base">
                    Message
                  </label>
                  <textarea
                    required
                    onChange={(e) => handleChanged(e)}
                    value={contactFrom.message}
                    id="message"
                    className="w-full p-1 placeholder:text-xs md:p-3 md:placeholder:text-base border border-gray-300 rounded-lg mt-1 h-24"
                    placeholder="Write your message"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full mt-4 bg-primary-normal text-white py-1 md:py-3 rounded-lg hover:bg-primary-normal-hover transition"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Contact;
