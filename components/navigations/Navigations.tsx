export function Footer() {
  return (
<footer className="p-10 footer footer-horizontal footer-center text-primary-content">
      <a
        className="flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        For concerns contact respective <b>MIS Help Desk</b> for your location
      </a>
    </footer>
  );
}

export function Drawer({ ui }: { ui: React.ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="flex flex-col drawer-content">
        {/* Navbar */}
        <div className="flex flex-row lg:hidden">
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
          <div className="flex-1">
            <a className="text-xl btn btn-ghost">Projext Next Hop</a>
          </div>
        </div>
        <div className="shadow-sm navbar bg-base-100">
          <div className="flex-1">
            <a className="text-xl btn btn-ghost">Network Management</a>
          </div>
          <div className="flex-none">
            <ul className="px-2 menu menu-horizontal">
              <li>
                <a>Client Devices</a>
              </li>
              <li>
                <details>
                  <summary>Network Devices</summary>
                  <ul className="p-2 rounded-t-none bg-base-100">
                    <li>
                      <a>Switches</a>
                    </li>
                    <li>
                      <a>Routers</a>
                    </li>
                    <li>
                      <a>Controllers</a>
                    </li>
                    <li>
                      <a>Access Points</a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="w-24 p-2 mt-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box z-1"
              >
                <li>
                  <a className="justify-between">Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Page content here */}
        {ui}
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
