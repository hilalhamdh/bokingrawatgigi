// Footer.jsx
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#87CEEB] text-white py-6 ">
      <div className="container mx-auto px-4 flex  items-center justify-center gap-4">
        {/* Logo */}

        <p className="text-sm text-center ">
          © {year} Poling Gigiku. All rights reserved.
        </p>
      </div>

      {/* Copyright */}
    </footer>
  );
};

export default Footer;
