import { Navigations } from "@/components/Navigations";
import { Statistics } from "@/components/views/Statistics";

export default function Home() {
  return (
    <div className="font-mono flex flex-col items-center justify-items-center min-h-screen">
      <main className="flex flex-col  items-center min-h-screen min-w-full sm:items-start">
      <Navigations>
        <Statistics></Statistics>
      </Navigations>
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
  );
}
