// import React, { useContext } from "react";
// import { assets } from "../assets/assets";
// import { NavLink } from "react-router-dom";
// import { DoctorContext } from "../context/DoctorContext";
// import { AdminContext } from "../context/AdminContext";

// const Sidebar = () => {
//   const { dToken } = useContext(DoctorContext);
//   const { aToken } = useContext(AdminContext);

//   const adminLinks = [
//     ["/admin-dashboard", assets.home_icon, "Dashboard"],
//     ["/all-appointments", assets.appointment_icon, "Appointments"],
//     ["/add-doctor", assets.add_icon, "Add Doctor"],
//     ["/doctor-list", assets.people_icon, "Doctors List"],
//   ];

//   const doctorLinks = [
//     ["/doctor-dashboard", assets.home_icon, "Dashboard"],
//     ["/doctor-appointments", assets.appointment_icon, "Appointments"],
//     ["/doctor-profile", assets.people_icon, "Profile"],
//   ];

//   const links = aToken ? adminLinks : dToken ? doctorLinks : [];

//   return (
//     <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-12px_35px_rgba(15,23,42,0.08)] md:sticky md:top-[73px] md:min-h-[calc(100vh-73px)] md:w-72 md:shrink-0 md:border-r md:border-t-0 md:px-4 md:py-4 md:shadow-none">
//       <nav className="grid grid-cols-4 gap-1 md:block md:space-y-2">
//         {links.map(([to, icon, label]) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `flex min-h-14 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-[11px] font-semibold transition md:min-h-0 md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 md:text-sm ${isActive ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-teal-50 hover:text-primary"}`
//             }
//           >
//             <img className="h-5 w-5 shrink-0" src={icon} alt="" />
//             <span className="max-w-full truncate">{label}</span>
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  const adminLinks = [
    {
      path: "/admin-dashboard",
      icon: assets.home_icon,
      label: "Dashboard",
    },
    {
      path: "/all-appointments",
      icon: assets.appointment_icon,
      label: "Appointments",
    },
    {
      path: "/add-doctor",
      icon: assets.add_icon,
      label: "Add Doctor",
    },
    {
      path: "/doctor-list",
      icon: assets.people_icon,
      label: "Doctors",
    },
  ];

  const doctorLinks = [
    {
      path: "/doctor-dashboard",
      icon: assets.home_icon,
      label: "Dashboard",
    },
    {
      path: "/doctor-appointments",
      icon: assets.appointment_icon,
      label: "Appointments",
    },
    {
      path: "/doctor-profile",
      icon: assets.people_icon,
      label: "Profile",
    },
  ];

  const links = aToken ? adminLinks : dToken ? doctorLinks : [];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-[250px] flex-col border-r border-slate-200 bg-white min-h-screen sticky top-0">
        {/* TOP */}
        <div className="px-6 py-7 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {aToken ? "Admin Panel" : "Doctor Panel"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Welcome to MediSync</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2 p-4">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                }`
              }
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${"bg-slate-100 group-hover:bg-white"}`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="h-5 w-5 object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-semibold">{item.label}</span>

                <span
                  className={`text-xs ${"text-slate-400 group-hover:text-slate-500"}`}
                >
                  Manage {item.label.toLowerCase()}
                </span>
              </div>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {links.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl py-2 transition-all ${
                    isActive ? "bg-primary text-white" : "text-slate-500"
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`h-5 w-5 object-contain ${
                      isActive ? "brightness-0 invert" : ""
                    }`}
                  />

                  <span className="mt-1 text-[11px] font-medium">
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
