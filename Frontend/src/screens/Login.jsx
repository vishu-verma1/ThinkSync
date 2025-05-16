import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { userContext } from "../context/user.context";
const Login = () => {
  const { setUser } = useContext(userContext)

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.post('users/login', {
      email,
      password

    }).then((res) => {
      // console.log("login req res-----", res)
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      // console.log("login req res-----", res.data)
      setEmail("")
      setPassword("")
      navigate("/");
      setShowError(false)
    }).catch((err) => {
      setShowError(true)
      console.log("error occured in login axios ", err)
    })

  };

  return (

    <div className=" bg-[#D9D9D9] h-screen w-screen font-raleway">
      <div className="bg-[url('./images/bg.png')]  h-full w-full ">
        <div className="  h-screen  w-full   flex justify-center items-center ">
          <div className="h-auto  w-80 md:w-11/12   xl:w-2/3   lg:w-2/3   2xl:w-2/3   justify-center flex bg-whit/5 rounded-md bg-clip-padding lg:backdrop-filter  md:backdrop-filter  shadow-2xl md:backdrop-blur-md lg:backdrop-blur-md md:bg-opacity-30 lg:bg-opacity-30  ">
            <div className="  h-full w-0 md:w-1/2 lg:w-1/2 lg:flex justify-center invisible lg:visible md:visible items-center ">
              <span className="flex flex-col items-center lg:mb-16 md:mt-16">
                <img src="./images/register.png" alt="" />
                <h1 className="text-3xl md:text-2xl font-bold text-black font-racing">
                  ThyncSync
                </h1>
                <h3 className="text-2xl md:text-1xl md:px-8 md:text-center mt-3 text-black font-semibold">
                  Welcome Again To Our Colaboration platform 
                </h3>
                {showError && (<div><h3 className="mt-3 md:mb-3 text-red-500">Invalid Email And Password !</h3></div>)}
              </span>
            </div>
            <div className=" mx-2 -mt-10 p-2 md:mx-0 md:mt-0 lg:mx-0 lg:mt-0 xl:mt-0 xl:mx-0 bg-black rounded-md lg:rounded-r-md md:rounded-r-md text-white h-auto w-96  lg:w-1/2 md:w-1/2">
              <div className="flex flex-col  justify-center h-full  items-center">
                <form onSubmit={handleSubmit}>

                  <div>
                    <h3 className="md:text-base ">Email</h3>
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      autoComplete="off"
                      required
                      className="outline-none md:text-sm  p-2 mb-5 xl:w-96 xl:text-lg w-72 md:w-56 bg-transparent border-b placeholder:text-sm"
                      type="email"
                      name="email"
                      id=""
                      placeholder="Please enter your Email"
                    />
                  </div>

                  <div>
                    <h3 className="md:text-base">Password</h3>
                    <input
                      value={password}
                      autoComplete="off"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      className="outline-none md:text-sm p-2 mb-5 xl:w-96 xl:text-lg w-72 md:w-56 bg-transparent border-b placeholder:text-sm "
                      type="password"
                      required
                      name="password"
                      id=""
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex justify-between gap-3 xl:mt-10 mt-2  items-center ">
                    <button
                      className="border-2 hover:bg-[#D9D9D9] hover:text-black  xl:text-lg md:text-sm font-medium rounded-md p-1 px-5 "
                      type="submit"
                      name="Create Account"

                    >
                      Login

                    </button>
                    <div className="text-sm">
                      dont't have an account?
                      <Link
                        to={"/register"}
                        className=" text-blue-400 text-base hover:text-[#D9D9D9] "
                      >

                        Create Account
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Login;
