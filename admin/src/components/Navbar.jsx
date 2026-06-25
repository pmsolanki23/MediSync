import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    navigate("/");
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
  };

  const goToUserPanel = () => {
    window.location.href = "http://localhost:5173/";
  };

  const isOnDashboard =
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/doctor-dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button onClick={() => navigate("/")}>
            <img
              className="h-10 w-32 object-contain object-left sm:h-11 sm:w-40"
              src={assets.admin_logo}
              alt="MediSync Admin"
            />
          </button>
          <span className="hidden rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            {aToken ? "Admin" : "Doctor"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isOnDashboard && (
            <button
              onClick={goToUserPanel}
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary sm:block"
            >
              User Panel
            </button>
          )}
          <button
            onClick={logout}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-950 sm:px-6"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
