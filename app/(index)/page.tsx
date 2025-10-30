import DirectorySearch from "@/components/Directory";
import ThemeToggle from "@/components/ThemeToggle";
import { Directory_header } from "@/components/Directory_Header";


export default function Home() {
  return (
    <Directory_header>
      <DirectorySearch />
    </Directory_header>
  )
}

