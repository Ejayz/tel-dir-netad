"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeToggle from "./ThemeToggle";

    export function Directory_header({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return(

    <div className="font-mono flex flex-col items-center justify-items-center min-h-screen">
      <main className="flex flex-col  items-center min-h-screen min-w-19/20 sm:items-start">
      <div className="w-full flex flex-row p-2 justify-end mt-5">
        <div className="mx-2 flex-1 uppercase font-mono font-bold text-xl ml-10">
          Telephone Directory Management
        </div>
        <div className="flex ">
          <ThemeToggle />
          <a href="/login" className="btn btn-secondary btn-outline mx-4 mr-12">Login</a>
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