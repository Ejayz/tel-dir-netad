import { Navigations } from "@/components/Navigations";
import { Footer } from "@/components/navigations/Navigations";
import { Statistics } from "@/components/views/Statistics";
import { Bounce, ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen font-mono justify-items-center">
      <main className="flex flex-col items-center min-w-full min-h-screen sm:items-start">
        <Navigations>
          <Statistics></Statistics>
        </Navigations>
      </main>
      <Footer />
    </div>
  );
}
