import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-20 lg:mt-24 border-t border-slate-200 py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-0">
      <div className="grid gap-6 sm:gap-8 lg:gap-10 text-xs sm:text-sm lg:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3 sm:space-y-4">
          <img className="h-10 sm:h-12 w-28 sm:w-36 object-contain object-left" src={assets.logo} alt="MediSync Logo" />
          <p className="max-w-xl leading-5 sm:leading-6 text-slate-500 text-xs sm:text-sm">
            MediSync brings doctor discovery, appointment booking, profile management, and payment-ready appointment tracking into one clean healthcare experience.
          </p>
        </div>
        <div>
          <p className="mb-2 sm:mb-4 text-sm sm:text-base font-semibold text-slate-950">Company</p>
          <ul className="space-y-1 sm:space-y-2 text-slate-500 text-xs sm:text-sm">
            <li className="cursor-pointer hover:text-primary transition">Home</li>
            <li className="cursor-pointer hover:text-primary transition">About Us</li>
            <li className="cursor-pointer hover:text-primary transition">Contact Us</li>
            <li className="cursor-pointer hover:text-primary transition">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 sm:mb-4 text-sm sm:text-base font-semibold text-slate-950">Get in touch</p>
          <ul className="space-y-1 sm:space-y-2 text-slate-500 text-xs sm:text-sm">
            <li>+91-90000-90000</li>
            <li>customersupport@MediSync.in</li>
          </ul>
        </div>
      </div>
      <p className="mt-6 sm:mt-8 lg:mt-10 border-t border-slate-200 pt-3 sm:pt-5 text-center text-xs sm:text-sm text-slate-500">
        Copyright 2026 MediSync.in. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
