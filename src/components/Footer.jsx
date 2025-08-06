// Footer.jsx
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#87CEEB] text-white py-6 ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <p className="text-sm text-center md:text-right">
          © {year} Badan Intelijen Negara. All rights reserved.
        </p>
        <div className="flex gap-4 justify-center">
          <img
            src="/bin.jpg"
            alt="Logo 1"
            className="h-10 w-10 rounded-full object-cover"
          />
          <img
            src="/med.png"
            alt="Logo 2"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>

        {/* Copyright */}
      </div>
    </footer>
  );
};

export default Footer;
