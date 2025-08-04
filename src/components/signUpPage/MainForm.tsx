import  { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { tokenAge } from "../../constant/constants";
import {  useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// import Navbar from "../landingPage/Navbar";

const MainForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [, setCookie, ] = useCookies(["token"]);
  const [, setUser] = useState({});
  const [, setRole] = useState("");
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const [emailError, setEmailError] = useState("");

  const signupSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must 20 characters or less")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers,and underscores are allowed"
      )
      .test("not same as first name", function (value) {
        return value !== this.parent.first_name;
      })
      .required("Name is required"),
    first_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "First Name must contain only letter")
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    last_name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Last Name must contain only letter")
      .min(2, "Last Name must be at least 2 characters")
      .required("Last Name is required"),
    phone_number: Yup.string()
      .matches(/^[0-9]{10}$/, "phone number must be exactly 10 digits")
      .required("phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[!@#$%^&*]/, "Must contain at least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const functionpop = async ({ username }: { username: string }) => {
    try {
      // In a real app, adjust the URL as needed
      const response = await fetch(`https://groceries-to-go-back-end.vercel.app/api/checkUsername`, {
        method: "POST",
        body: JSON.stringify({
          username: username.toLowerCase(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.data !== null) {
          toast("please try different username");

          setSignupError("Alredy username exists");
        } else {
          setSignupError("New user");
        }

        // navigate("/registrationSuccess");
      } else {
        console.error("Unable to login");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setSignupError("Something went Wrong. Please try again later.");
    }
  };
  const functionpopEmail = async ({ email }: { email: string }) => {
    try {
      // In a real app, adjust the URL as needed
      const response = await fetch(`https://groceries-to-go-back-end.vercel.app/api/checkEmail`, {
        method: "POST",
        body: JSON.stringify({
          email: email.toLowerCase(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.data !== null) {
          !isLogin ? toast("please try different email") : "";
          setEmailError("Alredy email exists");
        } else {
          setEmailError("New email");
        }
      }

      // navigate("/registrationSuccess");
      else {
        console.error("Unable to login");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setSignupError("Something went Wrong. Please try again later.");
    }
  };

  const handleSignup = async (values:any) => {
    const { username, first_name, last_name, phone_number, email, password } =
      values;
    try {
      // In a real app, adjust the URL as needed
      const response = await fetch(`https://groceries-to-go-back-end.vercel.app/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
        }),
      });
      if (response.ok) {
        toast("registertion completed");
        navigate("/registrationSuccess");
      } else {
        console.error("Unable to login");
        const data = await response.json();
        if (data.message === "Username already exists") {
          setSignupError("Invalid UserName already taken");
        } else {
          setSignupError("Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setSignupError("Something went Wrong. Please try again later.");
    }
  };
  // console.log("user info:", user);
  // console.log("user role info:", role);
  const handleLogin = async (values:any) => {
    const { email, password } = values;
    try {
      // In a real app, adjust the URL as needed
      const response = await fetch(
        `https://groceries-to-go-back-end.vercel.app/api/auth/login/${email}/${password}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const fetchUser = await response.json();
        setUser(fetchUser.data.user);
        setRole(fetchUser.data.role);

        if (fetchUser && fetchUser.data.user.status) {
          setCookie("token", fetchUser.data.token, {
            maxAge: tokenAge.maxAge,
          });
          switch (fetchUser.data.role.role_name) {
            case "staff":
              navigate("/staffDashboard");
              break;
            case "manager":
              navigate("/managerDashboard");
              break;
            case "admin":
              navigate("/adminDashboard");
              break;
            default:
              break;
          }
        } else {
          alert("not approve by admin");
          // console.error("not approve by admin");
        }
      } else {
        console.error("Unable to login");
        toast("Email and Password Incorrect", {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen min-w-screen"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/952353/pexels-photo-952353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-gray-800 p-8 shadow-lg rounded-lg text-white">
        <div className="flex mb-6">
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-l-lg transition-all ${
              isLogin ? "bg-gray-400" : "bg-gray-600"
            }`}
            onClick={() => {
              setIsLogin(true);
              setLoginError("");
            }}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-r-lg transition-all ${
              !isLogin ? "bg-gray-400" : "bg-gray-600"
            }`}
            onClick={() => {
              setIsLogin(false);
              setLoginError("");
            }}
          >
            Signup
          </button>
        </div>

        <Formik
          key={isLogin ? "login" : "signup"}
          initialValues={
            isLogin
              ? { email: "", password: "" }
              : {
                  // userId: "",
                  // rollId: "",
                  username: "",
                  first_name: "",
                  last_name: "",
                  phone_number: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }
          }
          validationSchema={isLogin ? loginSchema : signupSchema}
          onSubmit={(values) =>
            isLogin ? handleLogin(values) : handleSignup(values)
          }
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium">
                      Username:{" "}
                      <span className="text-sm text-slate-100 font-bold text-center">
                        {!isLogin ? signupError : ""}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={values.username}
                      onChange={(e) => {
                        handleChange(e);
                        functionpop({ username: e.target.value });
                      }}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                    />
                    {touched.username && errors.username && (
                      <div className="text-sm text-red-500">
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      First Name:
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (/\d/.test(e.key)) e.preventDefault();
                      }}
                      className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                    />
                    {touched.first_name && errors.first_name && (
                      <div className="text-sm text-red-500">
                        {errors.first_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Last Name:
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (/\d/.test(e.key)) e.preventDefault();
                      }}
                      className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                    />
                    {touched.last_name && errors.last_name && (
                      <div className="text-sm text-red-500">
                        {errors.last_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Phone Number:
                    </label>
                    <input
                      type="number"
                      name="phone_number"
                      value={values.phone_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                    />
                    {touched.phone_number && errors.phone_number && (
                      <div className="text-sm text-red-500">
                        {errors.phone_number}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium">
                  Email:{" "}
                  <span className="text-sm text-slate-100 font-bold text-center">
                    {!isLogin ? emailError : ""}
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                    functionpopEmail({ email: e.target.value });
                  }}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                />
                {touched.email && errors.email && (
                  <div className="text-sm text-red-500">{errors.email}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                />
                {touched.password && errors.password && (
                  <div className="text-sm text-red-500">{errors.password}</div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-2 border rounded-lg text-black bg-gray-200"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {isLogin && loginError && (
                <div className="text-sm text-red-500 text-center">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gray-700 py-2 px-4 disabled:cursor-not-allowed rounded-lg shadow-md hover:bg-gray-600"
                disabled={
                  signupError === "Alredy username exists" ||
                  (!isLogin && emailError === "Alredy email exists")
                    ? true
                    : false
                }
              >
                {isLogin ? "Login" : "Signup"}
              </button>

              {isLogin && (
                <p className="text-center text-sm text-white">
                  Not a member?{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign up
                  </span>
                </p>
              )}
              <p className="text-center text-sm text-white">
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => (window.location.href = "/")}
                >
                  Back to home
                </span>
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MainForm;
