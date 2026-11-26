import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/api";
import Nav from "@/components/Nav";
import UserMenu from "@/components/UserMenu";
import { getInitials } from "@/utils";

export default async function Header() {
  const response = await getProfile();
  const user = response.data?.user;

  return (
    <header className="bg-white px-4 py-4 md:px-10">
      <div className="mx-auto flex max-w-[1215px] flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard">
          <Image
            src="/logo.svg"
            alt="Abricot"
            width={147}
            height={19}
            priority
          />
        </Link>

        <div className="order-last flex w-full justify-center md:order-none md:w-auto">
          <Nav />
        </div>

        <UserMenu initials={user?.name ? getInitials(user.name) : undefined} />
      </div>
    </header>
  );
}
