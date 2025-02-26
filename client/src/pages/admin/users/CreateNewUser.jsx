import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Input, Button } from "@mui/material";
import { useCreateUserMutation } from "../../../redux/apis/AdminApi";
import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import PopUpMessages from "../../../components/popup/PopUpMasseges";

const CreateNewUser = ({ setPopupAdd }) => {
  const { token } = useSelector((state) => state.user);
  const [error, setError] = useState("");

  const [createUser , {isSuccess}] = useCreateUserMutation();

  // Yup Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Name must have at least 3 characters")
      .max(30, "Name cannot exceed 30 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Please provide a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must have at least 8 characters")
      .max(50, "Password cannot exceed 50 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone is required"),
  });

  // Handling user creation
  const handleAddUser = async (values, { resetForm }) => {
    try {
      await createUser({ token, formData: values }).unwrap();
      // setPopupAdd(false);
      resetForm(); // Reset form fields after successful creation
    } catch (error) {
      setError(error?.data?.message || "Something went wrong!");
      console.log(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 w-full mx-auto"
    >
      <div className="text-red-400">{error}</div>
      {isSuccess && <PopUpMessages message="successfully add new user" code={201}/>}

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddUser}
      >
        {({ isSubmitting, errors, touched, resetForm }) => (
          <Form className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0 space-y-4">
              <label htmlFor="username" className="flex-1 block">
                <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-1 block">
                  Name
                </span>
                <Field
                  as={Input}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter name"
                  className="border p-3 rounded-lg w-full"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </label>

              <label htmlFor="email" className="flex-1 block">
                <span className="text-sm sm:text-base md:text-base font-medium text-gray-700 mb-1 block">
                  Email
                </span>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  className="border p-3 rounded-lg w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-6 sm:space-y-0 space-y-4">
              <label htmlFor="phone" className="flex-1 block">
                <span className="text-sm sm:text-base md:text-base font-medium text-gray-700 mb-1 block">
                  Phone
                </span>
                <Field
                  as={Input}
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter phone"
                  className="border p-3 rounded-lg w-full"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </label>

              <label htmlFor="password" className="flex-1 block">
                <span className="text-sm sm:text-base md:text-base font-medium text-gray-700 mb-1 block">
                  Password
                </span>
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  className="border p-3 rounded-lg w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </label>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row item-center">
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => setPopupAdd(false)}
                className="w-full py-2 text-white text-sm sm:text-base md:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full py-2 text-white text-sm sm:text-base md:text-base"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                ADD
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

CreateNewUser.propTypes = {
  setPopupAdd: PropTypes.func.isRequired,
};

export default CreateNewUser;
