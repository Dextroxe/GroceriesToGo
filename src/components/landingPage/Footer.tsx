import React from "react";

const Footer = () => {
  return (
    <footer className="text-center bg-gray-100 py-6 mt-10">
      <p className="text-lg font-semibold">For Better Service Download Now</p>
      <div className="flex justify-center space-x-4 mt-4">
        <img src="/path-to-google-play.png" alt="Google Play" className="w-32" />
        <img src="/path-to-app-store.png" alt="App Store" className="w-32" />
      </div>
    </footer>
  );
};

export default Footer;