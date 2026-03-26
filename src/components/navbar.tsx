import Link from "next/link";
import UserButton from "./user-button";
import SearchField from "./search-field";

function Navbar() {
  return (
    <header className="bg-card sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <div className="flex gap-3">
          <Link href="/" className="text-primary text-2xl font-bold outline-0">
            Social App
          </Link>
          <SearchField />
        </div>
        <UserButton />
      </div>
    </header>
  );
}

export default Navbar;
