// Footer.jsx
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#87CEEB] text-white py-6 ">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        {/* Logo */}

        <p className="text-sm text-center ">
          © {year} Poling Gigiku. All rights reserved.
        </p>

        {/* <div className="flex gap-4 justify-center md:justify-end">
          <img
            src="/bg.jpg"
            alt="Logo 1"
            className="h-10 w-10 rounded-full object-cover"
          />
          <img
            src="/logo.jpg"
            alt="Logo 2"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div> */}
      </div>

      {/* Copyright */}
    </footer>
  );
};

export default Footer;
