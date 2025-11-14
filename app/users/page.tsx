import { Navigations } from "@/components/Navigations";
import { Footer } from "@/components/navigations/Navigations";
import {is_admin} from "@/components/TokenCheck";
import Users from "@/components/views/Users";

export default async function Home() {
  const setpage = 10;
  return (
    <div className="flex flex-col items-center min-h-screen font-mono justify-items-center">
      <main className="flex flex-col items-center min-w-full min-h-screen sm:items-start">
        <Navigations
        Admin={await is_admin() ? true : false}>
          <Users />
        </Navigations>
      </main>
      <Footer />
    </div>
  );
}
