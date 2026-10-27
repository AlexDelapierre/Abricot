import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between bg-white px-4 py-4 md:px-10">
      <Image src="/logo-black.svg" alt="Abricot" width={98} height={13} />
      <p className="text-sm">Abricot 2025</p>
    </footer>
  );
}
