"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getcookieValue } from "@/libs/Tools";

const THEME_KEY = "theme";

export default function ThemeToggle() {

  let [theme, setTheme] = useState('light')
  const [isChecked, setIsChecked] = useState(false);
  // let [ctheme,setCtheme] = useState('light')

  useEffect(() => {

    const cookies = document.cookie; //get Cookies
    setTheme(getcookieValue(cookies,'theme'));
    setIsChecked( theme === 'dark');
    
  },)

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"; 
    Cookies.set(THEME_KEY, next);
    setTheme(next);
    setIsChecked(!isChecked);
    document.documentElement.setAttribute("data-theme", next);
  };


  return (
    //swap swap-rotate
    <label className=" swap swap-rotate rounded-md p-1 hover:bg-gray-600">
      <input
        type="checkbox"
        role="switch"
        aria-label="Toggle theme"
        checked={isChecked}
        onChange={toggle}
        className="hidden"
      />

      {/* Sun icon (light) */}
      <svg
        className={`swap-off fill-current w-6 h-6 text-yellow-400`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.66-2.46l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM17 13h3v-2h-3v2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-7h-2v3h2V0zM4.24 19.16l-1.79 1.79 1.41 1.41 1.8-1.79-1.42-1.41z" />
      </svg>

      {/* Moon icon (dark) */}
      <svg
        className={`swap-on fill-current w-6 h-6 text-gray-200`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </label>
  );
}
