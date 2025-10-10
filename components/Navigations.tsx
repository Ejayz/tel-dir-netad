"use client"

import { useCookies } from "next-client-cookies";
import { useEffect } from "react";



export function Navigations({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){

useEffect(()=>{
  const process = async ()=>{
const cookies = await useCookies()

console.log(cookies.get("token"))
  }
  process()
},[])





    return <div className="drawer">
  <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content flex flex-col">
    {/* Navbar */}
    <div className="navbar bg-base-300 w-full">
      <div className="flex-none lg:hidden">
        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="mx-2 flex-1 px-2 uppercase font-mono font-bold">Telephone Directory Management</div>
      <div className="hidden flex-none lg:block">
        <ul className="menu menu-horizontal">
          {/* Navbar menu content here */}
          <li><a>Dashboard</a></li>
          <li>
        <details>
          <summary>Management</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
           <li><a>Local</a></li>
          <li><a>Group</a></li>
          <li><a>Department</a></li>
          <li><a>Location</a></li>
          </ul>
        </details>
      </li>
               <li><a>Users</a></li>
                    <li><a>Account</a></li>
 <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <div>
            
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
        </ul>
      </div>
    </div>
    {/* Page content here */}
    {children}
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu bg-base-200 min-h-full w-80 p-4">
      {/* Sidebar content here */}
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
}