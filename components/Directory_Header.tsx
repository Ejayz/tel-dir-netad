"use client";

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FaRegUserCircle } from "react-icons/fa";
import { Bounce, ToastContainer } from "react-toastify";
import ThemeToggle from "./ThemeToggle";

    // export default function directory_header({ children }:{children: ReactNode}) {
    //   const [queryClient] = useState(() => new QueryClient());
    //   return (
    //     <QueryClientProvider client={queryClient}>
    //       {children}
    //     </QueryClientProvider>
    //   );
    // }
    export function Directory_header({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return(

    <div className="font-mono flex flex-col items-center justify-items-center min-h-screen">
      <main className="flex flex-col  items-center min-h-screen min-w-3/4 sm:items-start">
      <div className="w-full flex flex-row p-2 justify-end mt-5">
        <div className="mx-2 flex-1 uppercase font-mono font-bold">
          Telephone Directory Management
        </div>
        <div className="flex ">
          <ThemeToggle />
          <a href="/login" className="btn btn-secondary btn-outline mx-4">Login</a>
        </div>
      </div>
      <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      <div>
      </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Having a problem ? Contact us 3907 Net Ad Team
        </a>
      </footer>
    </div>
  )
}