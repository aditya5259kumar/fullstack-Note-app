import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import { Link, useNavigate } from "react-router-dom";
import Password from "../components/input/Password";
import axiosInstance from "../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    // login API call-
    try {
      setLoading(true);

      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      const token = response.data?.data?.token;

      if (token) {
        localStorage.setItem("token", token);

        toast.success("User logged in successfully");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        newErrors.loginError = "Login failed. No token received.";
      }
    } catch (err) {
      newErrors.loginError =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
    } finally {
      setLoading(false);
    }
    setError(newErrors);
  }

  return (
    <>
      <div className="absolute top-0 right-0 left-0 flex flex-colflex px-4 flex-col min-h-screen items-center justify-center bg-yellow-50">
        <h2 className="text-yellow-700 mb-1 text-3xl  text-center font-extrabold">
          Welcome To Notely
        </h2>
        <p className="text-center text-sm mb-4">
          A fast and simple space for your notes and ideas.
        </p>
        <div className="sm:w-96 bg-white w-full shadow-2xl  rounded-2xl px-7 py-10">
          <h2 className="text-yellow-800 mb-4 text-xl  text-center font-bold">
            Welcome To Notely
          </h2>
          <form onSubmit={handleLogin}>
            <h4 className="text-center font-bold  text-yellow-500 text-3xl mb-7">
              Login
            </h4>

            {error.loginError && (
              <p className="mb-1 text-red-500 text-xs mt-1">
                {error.loginError}
              </p>
            )}

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className=" w-full bg-white font-medium text-sm border px-5 py-3 border-gray-400 text-gray-600 rounded-md mb-1 outline-none"
            />
            {error.email && (
              <p className="mb-4 text-red-500 text-xs mt-1">{error.email}</p>
            )}

            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && (
              <p className="mb-1 text-red-500 text-xs mt-1">{error.password}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white rounded p-2 my-1 mt-4 transition-all duration-200
  ${
    loading
      ? "bg-yellow-300 cursor-not-allowed"
      : "bg-linear-to-r from-yellow-400 to-yellow-700 hover:opacity-90"
  }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>

            <p className="text-sm text-center mt-4">
              don't have Account? {""}
              <Link to="/signup" className="font-bold text-yellow-600">
                Create an Account.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
