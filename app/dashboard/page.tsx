import { Navigations } from "@/components/Navigations";
import { Statistics } from "@/components/views/Statistics";
import { Bounce, ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="font-mono flex flex-col items-center justify-items-center min-h-screen">
      <main className="flex flex-col  items-center min-h-screen min-w-full sm:items-start">
      <Navigations>
        <Statistics></Statistics>
      </Navigations>
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
/>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Having a problem ? Contact us 1000 Net Ad team

        </a>
      </footer>
    </div>
  );
}
