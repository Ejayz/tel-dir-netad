import { Navigations } from "@/components/Navigations";
import Location from "@/components/views/Location";

export default function Home() {
  return (
    <>
      <main className="flex flex-col  items-center min-h-screen min-w-full sm:items-start">
        <Navigations>
          <Location />
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
    </>
  );
}
