import React from "react";
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="bg-white w-screen h-screen flex flex-col justify-center items-center">
      {/* 404 */}
      <div className="">
          <img src={`${process.env.PUBLIC_URL}/404error.png`} className="w-[460px] h-auto:" alt="app icon"></img>
      </div>

      {/* Text */}
      <div className="text-blue-600 text-[36px] font-[600px] mt-[40px] ">
        What on earth are you doing here!?
      </div>

      <div className="text-blue-900 font-[600px] ">
        Well, this is awkward, the page you were trying to view does not exist.
      </div>

      {/* Link to Home */}
      <div className="mt-[50px]">
        <Link to="/">
          <div className="text-blue-500 text-[30px] font-[600px]  underline underline-offset-8 hover:text-blue-700 ">
            To Homepage
          </div>
        </Link>
      </div>

    </div>  
  )

};

export default NotFound;
