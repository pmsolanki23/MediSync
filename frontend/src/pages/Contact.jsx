// import React from 'react'
// import { assets } from '../assets/assets'

// const Contact = () => {
//   return (
//     <main className='py-6'>
//       <section className='grid overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-slate-200 md:grid-cols-[1fr_.9fr]'>
//         <div className='space-y-6 p-8 sm:p-10 lg:p-14'>
//           <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>Contact us</p>
//           <h1 className='text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl'>Need help with booking or managing appointments?</h1>
//           <div className='grid gap-4 text-sm text-slate-500 sm:grid-cols-2'>
//             <div className='rounded-[8px] bg-[#f7fbfa] p-5'>
//               <p className='font-semibold text-slate-950'>Office</p>
//               <p className='mt-2 leading-6'>54709 Willms Station<br />Suite 350, Washington, USA</p>
//             </div>
//             <div className='rounded-[8px] bg-[#f7fbfa] p-5'>
//               <p className='font-semibold text-slate-950'>Support</p>
//               <p className='mt-2 leading-6'>+91-90000-90000<br />customersupport@MediSync.in</p>
//             </div>
//           </div>
//           <button className='rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-950'>Explore Jobs</button>
//         </div>
//         <img className='h-full min-h-[420px] w-full object-cover' src={assets.contact_image} alt='MediSync support' />
//       </section>
//     </main>
//   )
// }

// export default Contact



import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (

    <main className="py-6 sm:py-10">

      <section className="relative overflow-hidden rounded-2xl bg-white shadow-sm sm:rounded-[32px]">

        {/* BACKGROUND */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#f8fcff] via-white to-[#f3fbff]" />

        {/* BLUR EFFECTS */}

        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"></div>

        <div className="absolute bottom-[-80px] right-[-80px] h-80 w-80 rounded-full bg-blue-100/50 blur-3xl"></div>

        {/* CONTENT */}

        <div className="relative z-10 grid items-center gap-6 md:grid-cols-[1fr_.95fr] lg:gap-10">

          {/* LEFT */}

          <div className="px-5 py-10 sm:px-10 sm:py-12 lg:px-16">

            {/* SMALL TAG */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-5 py-2 text-sm font-medium text-cyan-700">

              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>

              CONTACT MEDISYNC

            </div>

            {/* HEADING */}

            <h1 className="max-w-xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">

              We’re Here To Help
              You Anytime

            </h1>

            {/* TEXT */}

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">

              Need assistance with appointments, doctors, or your healthcare
              experience? Our support team is always ready to help you.

            </p>

            {/* CARDS */}

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">

              {/* OFFICE */}

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />

                  </svg>

                </div>

                <h3 className="text-lg font-semibold text-slate-900">

                  Our Office

                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">

                  54709 Willms Station <br />
                  Suite 350, Washington, USA

                </p>

              </div>

              {/* SUPPORT */}

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">

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
                      d="M3 5a2 2 0 012-2h3.28a2 2 0 011.894 1.368l1.518 4.555a2 2 0 01-.502 2.09l-1.274 1.274a16.042 16.042 0 006.586 6.586l1.274-1.274a2 2 0 012.09-.502l4.555 1.518A2 2 0 0121 15.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                    />

                  </svg>

                </div>

                <h3 className="text-lg font-semibold text-slate-900">

                  Support

                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">

                  +91-90000-90000 <br />
                  customersupport@MediSync.in

                </p>

              </div>

            </div>

            {/* BUTTON */}

            <button className="mt-10 rounded-2xl bg-cyan-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-cyan-700">

              Contact Support

            </button>

          </div>

          {/* RIGHT IMAGE */}

          <div className="relative flex items-end justify-center px-4 pt-8 sm:px-6 sm:pt-10 lg:px-0">

            {/* IMAGE BG */}

            <div className="absolute h-[70vw] max-h-[420px] w-[70vw] max-w-[420px] rounded-full bg-cyan-100/70"></div>

            {/* IMAGE */}

            <img
              className="relative z-10 max-h-[420px] w-full object-contain md:max-h-[620px]"
              src={assets.contact_image}
              alt="MediSync support"
            />

          </div>

        </div>

      </section>

    </main>
  );
};

export default Contact;
