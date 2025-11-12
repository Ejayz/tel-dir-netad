import { Navigations } from "@/components/Navigations";
import Group from "@/components/views/Group";
import is_admin from "@/components/AdminStatus";

export default async function Home() {
  return (
    <>
      <main className="flex flex-col  items-center min-h-screen min-w-full sm:items-start">
        <Navigations
        Admin={await is_admin()? true:false}>
         <Group />
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
