import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContextObject";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { doctors } = useContext(AppContext);

  const navigate = useNavigate();

  const availableCount = doctors.filter(
    (doctor) => doctor.available !== false,
  ).length;

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl bg-white shadow-sm sm:mt-8 sm:rounded-[28px] lg:mt-10 lg:rounded-[36px]">
      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#f8fcff] via-[#f3faff] to-[#eef7ff]" />

      {/* LIGHT BLURS */}

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"></div>

      <div className="absolute bottom-[-80px] right-[-80px] h-80 w-80 rounded-full bg-blue-100/50 blur-3xl"></div>

      {/* MAIN */}

      <div className="relative z-10 grid items-center gap-8 px-4 py-10 sm:px-8 sm:py-12 lg:min-h-[500px] lg:grid-cols-2 lg:px-16 xl:px-20">
        {/* ================= LEFT ================= */}

        <div className="max-w-2xl text-center lg:text-left">
          {/* BADGE */}

          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm sm:mb-6 sm:px-5 sm:text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            Trusted by Thousands of Patients
          </div>

          {/* HEADING */}

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
            Find Trusted
            <span className="block text-cyan-600">Doctors Near You</span>
          </h1>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
            Book appointments with experienced doctors, get instant
            consultation, and manage your healthcare journey with ease.
          </p>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:mt-10 lg:justify-start">
            <a
              href="#speciality"
              className="rounded-2xl bg-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-cyan-700 sm:px-8 sm:py-4"
            >
              Find a Doctor
            </a>

            <button
              onClick={() => navigate("/doctors")}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 sm:px-8 sm:py-4"
            >
              Browse Specialists
            </button>
          </div>

          {/* STATS */}

          <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-12 sm:flex sm:flex-wrap sm:justify-center sm:gap-5 lg:justify-start">
            {[
              {
                value: `${doctors.length}+`,
                label: "Doctors",
              },
              {
                value: `${availableCount}+`,
                label: "Available",
              },
              {
                value: "24/7",
                label: "Support",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-sm sm:px-6 sm:py-5"
              >
                <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {item.value}
                </h3>

                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:max-w-none">
          {/* BIG BACKGROUND CIRCLE */}

          <div className="absolute h-[72vw] max-h-[500px] w-[72vw] max-w-[500px] rounded-full bg-cyan-100/70"></div>

          {/* FLOATING TOP CARD */}

          <div className="absolute right-0 top-0 z-20 rounded-2xl bg-white px-4 py-3 shadow-xl sm:right-4 sm:top-1 sm:rounded-3xl sm:px-6 sm:py-5">
            <h2 className="text-2xl font-bold text-cyan-600 sm:text-3xl">
              {availableCount}+
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Available Doctors
            </p>
          </div>

          {/* FLOATING BOTTOM CARD */}

          <div className="absolute bottom-3 left-0 z-20 rounded-2xl bg-white px-4 py-3 shadow-xl sm:bottom-10 sm:rounded-3xl sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-emerald-100 sm:flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Verified Doctors
                </h3>

                <p className="text-xs text-slate-500">100% Trusted</p>
              </div>
            </div>
          </div>

          {/* IMAGE */}

          <img
            src={assets.header_img}
            alt="Doctors"
            className="relative z-10 w-full max-w-[520px] object-contain lg:max-w-[680px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
