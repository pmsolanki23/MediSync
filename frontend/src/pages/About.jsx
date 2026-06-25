// import React from 'react'
// import { assets } from '../assets/assets'

// const About = () => {
//   return (
//     <main className='py-6'>
//       <section className='grid overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-slate-200 md:grid-cols-[.9fr_1.1fr]'>
//         <img className='h-full min-h-[420px] w-full object-cover' src={assets.about_image} alt='MediSync care team' />
//         <div className='space-y-6 p-8 sm:p-10 lg:p-14'>
//           <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>About MediSync</p>
//           <h1 className='text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl'>Healthcare scheduling that feels simple, calm, and connected.</h1>
//           <p className='text-sm leading-7 text-slate-500'>
//             MediSync helps patients discover trusted doctors, book appointments, keep profile details updated, and stay aligned with their care schedule.
//           </p>
//           <p className='text-sm leading-7 text-slate-500'>
//             The platform is built for practical healthcare workflows: live doctor data from the API, working local fallback doctors for demos, fast speciality filters, and a focused booking journey.
//           </p>
//         </div>
//       </section>

//       <section className='my-16 grid gap-4 md:grid-cols-3'>
//         {[
//           ['Efficiency', 'Shorter paths from doctor discovery to confirmed appointment.'],
//           ['Convenience', 'A single place to browse, book, track, and manage visits.'],
//           ['Personalization', 'Profile and appointment data that keeps recurring care easier.'],
//         ].map(([title, copy]) => (
//           <div key={title} className='rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40'>
//             <p className='text-lg font-semibold text-slate-950'>{title}</p>
//             <p className='mt-3 text-sm leading-6 text-slate-500'>{copy}</p>
//           </div>
//         ))}
//       </section>
//     </main>
//   )
// }

// export default About

import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <main className="py-6 sm:py-10">
      {/* HERO SECTION */}

      <section className="relative overflow-hidden rounded-2xl bg-white shadow-sm sm:rounded-[32px]">
        {/* BACKGROUND */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#f8fcff] via-white to-[#f2faff]" />

        {/* BLUR EFFECTS */}

        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"></div>

        <div className="absolute bottom-[-90px] right-[-90px] h-80 w-80 rounded-full bg-blue-100/50 blur-3xl"></div>

        {/* MAIN */}

        <div className="relative z-10 grid items-center gap-6 md:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          {/* IMAGE SIDE */}

          <div className="relative flex items-end justify-center px-4 pt-8 sm:px-6 sm:pt-10 lg:px-0">
            {/* CIRCLE BG */}

            <div className="absolute h-[70vw] max-h-[420px] w-[70vw] max-w-[420px] rounded-full bg-cyan-100/70"></div>

            {/* IMAGE */}

            <img
              className="relative z-10 max-h-[420px] w-full object-contain md:max-h-[620px]"
              src={assets.about_image}
              alt="MediSync care team"
            />
          </div>

          {/* CONTENT */}

          <div className="px-5 py-10 sm:px-10 sm:py-12 lg:px-16">
            {/* TAG */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-5 py-2 text-sm font-medium text-cyan-700">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
              ABOUT MEDISYNC
            </div>

            {/* HEADING */}

            <h1 className="max-w-xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Simplifying Healthcare For Everyone
            </h1>

            {/* PARAGRAPHS */}

            <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              MediSync helps patients discover trusted doctors, book
              appointments instantly, and manage their healthcare experience
              from one seamless platform.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              Built with modern healthcare workflows in mind, MediSync focuses
              on speed, convenience, and a smooth patient experience for
              everyday care.
            </p>

            {/* BUTTON */}

            <button className="mt-10 rounded-2xl bg-cyan-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-cyan-700">
              Explore Doctors
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="mt-10 grid gap-5 sm:mt-16 md:grid-cols-3 lg:gap-6">
        {[
          {
            title: "Efficiency",
            desc: "Quick appointment booking with a smooth and fast healthcare experience.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ),
          },

          {
            title: "Convenience",
            desc: "Browse specialists, manage appointments, and stay connected anytime.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            ),
          },

          {
            title: "Personal Care",
            desc: "Keep your healthcare journey organized with personalized patient data.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-pink-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ),
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[30px] sm:p-8"
          >
            {/* ICON */}

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              {item.icon}
            </div>

            {/* TITLE */}

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              {item.title}
            </h2>

            {/* DESC */}

            <p className="mt-4 leading-7 text-slate-500">{item.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default About;
