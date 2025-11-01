"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FaRegUserCircle } from "react-icons/fa";
import { Bounce, ToastContainer } from "react-toastify";
import ThemeToggle from "./ThemeToggle";

export function Navigations({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();



  
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col drawer-content">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
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
          <div className="flex-1 px-2 mx-2 font-mono font-bold uppercase">
            Telephone Directory Management
          </div>
          <div className="flex-none hidden lg:block">
            <ThemeToggle />
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <details className="z-">
                  <summary>Management</summary>
                  <ul className="z-10 p-2 rounded-t-none bg-base-100">
                    <li>
                      <a href="/local">Local</a>
                    </li>
                    <li>
                      <a href="/group">Group</a>
                    </li>
                    <li>
                      <a>Department</a>
                    </li>
                    <li>
                      <a href="/location">Location</a>
                    </li>
                    <li>
                      <a href="/branch">Branch</a>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <a>Users</a>
              </li>
              <li>
                <a>Account</a>
              </li>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <FaRegUserCircle className="mx-auto my-auto text-3xl" />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="p-2 mt-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box z-1 w-52"
                >
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </ul>
          </div>
        </div>
        {/* Page content here */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
          className={"z-50"}
        />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="min-h-full p-4 menu bg-base-200 w-80">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
