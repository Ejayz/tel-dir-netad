import { Navigations } from "@/components/Navigations";
import Branch from "@/components/views/Branch";


export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center min-w-full min-h-screen sm:items-start">
        <Navigations>
         <Branch />
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
