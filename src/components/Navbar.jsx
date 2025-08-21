import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full  bg-white shadow-xl border-b-3 border-gray-300">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center justify-center  gap-4">
          <img
            src="/logo.jpg"
            className="w-7 h-7 md:w-10 md:h-10 rounded-full"
          />

          <Link
            to="/"
            className=" text-xl md:text-2xl font-bold text-[#76BBDD]"
          >
            RAWAT GIGIMU
          </Link>
        </div>

        {/* Right side: Buttons */}
        <div className="flex items-center space-x-4">
          {/* Future menu / icons */}

          {/* Login Admin */}
          <Link
            to="/login"
            className="bg-[#87CEEB] hover:bg-[#76BBDD] text-white px-2 md:px-4 py-1 md:py-2 rounded-lg text-sm font-semibold transition"
          >
            Login Admin
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
