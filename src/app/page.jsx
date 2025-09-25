"use client";
import { redirect } from "next/navigation";

export default function home() {
  const handleClick = () => {
    redirect("/login");
  };
  return (
    <div className="flex font-bold text-4xl justify-center items-center w-screen h-screen bg-yellow-500 ">
      <div className="text-center">
        <h1 className="">Welcome to the home-page of the Leads</h1>
        <button
          onClick={handleClick}
          className="p-2 rounded-lg mt-5 bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white"
        >
          Login Page
        </button>
      </div>
    </div>
  );
}
