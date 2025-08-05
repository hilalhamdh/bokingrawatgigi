import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-4">
          <img
            src="/src/assets/image/logo.jpg"
            className="w-10 h-10 rounded-full"
          />
          <Link to="/" className="text-2xl font-bold text-purple-700">
            RAWAT GITIMU
          </Link>
        </div>

        {/* Right side: Buttons */}
        <div className="flex items-center space-x-4">
          {/* Future menu / icons */}

          {/* Login Admin */}
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Login Admin
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
