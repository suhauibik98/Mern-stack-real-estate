import React from "react";
import { Box, Typography, Grid2, Link } from "@mui/material";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      className="bg-gray-800 text-white pt-5 "
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-5 lg:px-10 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Logo Section */}
          <motion.div
            className="col-span-1 flex items-center"
            initial={{ x: -100 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-3xl mb-4 text-primary-normal">AK RealEstate</h1>
          </motion.div>

          {/* Address Section */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-light mb-4">Address</h4>
            <p className="mb-2">
              <FaMapMarkerAlt className="inline-block mr-3" /> 87 Street, Irbid,
              JO
            </p>
            <p className="mb-2">
              <FaPhoneAlt className="inline-block mr-3" /> +962795901808
            </p>
            <p className="mb-2">
              <FaEnvelope className="inline-block mr-3" />{" "}
              sohayb.akour10@gmail.com
            </p>
            <div className="pt-2 flex space-x-3">
              <a href="#" className="text-light hover:text-gray-400">
                <FaTwitter />
              </a>
              <a href="#" className="text-light hover:text-gray-400">
                <FaFacebookF />
              </a>
              <a href="#" className="text-light hover:text-gray-400">
                <FaYoutube />
              </a>
              <a href="#" className="text-light hover:text-gray-400">
                <FaLinkedinIn />
              </a>
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-light mb-4">Services</h4>
            <a className="block mb-2 hover:text-gray-400" href="">
              Air Freight
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Sea Freight
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Road Freight
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Logistic Solutions
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Industry Solutions
            </a>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="text-light mb-4">Quick Links</h4>
            <a className="block mb-2 hover:text-gray-400" href="">
              About Us
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Contact Us
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Our Services
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Terms & Condition
            </a>
            <a className="block mb-2 hover:text-gray-400" href="">
              Support
            </a>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-5 lg:px-10 border-t border-gray-700 py-5">
        <div className="copyright py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-3 mb-sm-0">
              &copy;{" "}
              <a
                className="border-b"
                href="/"
              >
                AK REALESTATE
              </a>
              , All Rights Reserved.
            </div>
            <div className="text-center sm:text-right">
              Designed By{" "}
              <a className="border-b" href="/">
                AK REALESTATE
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
