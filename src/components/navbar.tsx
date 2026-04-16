import Link from "next/link";
import UserButton from "./user-button";
import { SearchField, SearchFieldLaptop } from "./search-field";
import logo from "@/assets/logo.png";
import Image from "next/image";

function Navbar() {
  return (
    <header className="bg-card sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <div className="flex gap-7">
          <Link
            href="/for-you"
            className="text-primary flex items-center gap-2 text-2xl font-bold outline-0"
          >
            <Image src={logo} alt="logo" width={40} height={40} />
            <span className="dark:text-white">Snappit</span>
          </Link>
          <SearchField>
            <SearchFieldLaptop />
          </SearchField>
        </div>
        <UserButton />
      </div>
    </header>
  );
}

export default Navbar;
