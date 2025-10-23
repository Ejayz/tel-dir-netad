"use client";

import ThemeToggle from "./ThemeToggle";
import pool from "@/libs/db";

export default function DirectorySearch() {
  return (
    <>
      <div className="w-full flex flex-row p-2 justify-end mt-5">
        <div className="mx-2 flex-1 uppercase font-mono font-bold">
            Telephone Directory Management
          </div>
        <div className="flex ">
          <ThemeToggle/>
          <a href="/login" className="btn btn-outline mx-4">Login</a>
        </div>
        
      </div>
      <div>
        <label className="input flex-auto ">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </div>
      <div className="divider"></div>
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Local</th>
              <th>Department</th>
              <th>Group</th>
              <th>Location</th>
              <th>Telephone System</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>3907</th>
              <td>MIS</td>
              <td>Network Administrator</td>
              <td>KMG</td>
              <td>NEC</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
              <td>NEC</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>NEC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
