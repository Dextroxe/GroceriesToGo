import React from "react";
import heroImage from "../../assets/hero-image.png"; // Replace with actual image

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 ">
      <div className="md:w-1/2 text-center md:text-left">
        <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
          Grocery Management Service
        </span>
        <h1 className="text-4xl font-bold mt-4">
          Make healthy life with <span className="text-green-600">fresh</span>{" "}
          grocery service
        </h1>
        <p className="text-gray-600 mt-4">
          Get the best quality and most reliable experience, you can get them
          all using our website.
        </p>
        <button
          onClick={() => (window.location.href = "/signUp")}
          className="mt-6 cursor-pointer bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Login Now
        </button>
      </div>
      <div className="md:w-1/2 mt-8 md:mt-0">
        <img
          src={heroImage}
          alt="Fresh groceries"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </section>
  );
};

export default HeroSection;
