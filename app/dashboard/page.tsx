import { Navigations } from "@/components/Navigations";
import { Footer } from "@/components/navigations/Navigations";
import DirectorySearch from "@/components/Directory";
import is_admin from "@/components/AdminStatus";

export default async function Home() {
  const setpage = 10;
  return (
    <div className="flex flex-col items-center min-h-screen font-mono justify-items-center">
      <main className="flex flex-col items-center min-w-full min-h-screen sm:items-start">

        <Navigations
        Admin={await is_admin() ? true : false}>
          <div className="w-11/12 mx-auto">
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <a>Dashboard</a>
                </li>
              </ul>
            </div>
          </div>
          <DirectorySearch />
        </Navigations>
      </main>
      <Footer />
    </div>
  );
}
