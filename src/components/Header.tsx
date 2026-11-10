import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/api";
import Nav from "@/components/Nav";
import UserMenu from "@/components/UserMenu";

export default async function Header() {
  const response = await getProfile();
  const user = response.data?.user;
  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-4 md:px-10">
      <Link href="/dashboard">
        <Image src="/logo.svg" alt="Abricot" width={147} height={19} priority />
      </Link>

      <div className="order-last flex w-full justify-center md:order-none md:w-auto">
        <Nav />
      </div>

      <UserMenu initials={initials} />
    </header>
  );
}
