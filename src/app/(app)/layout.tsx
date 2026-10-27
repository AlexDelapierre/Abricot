import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#content"
        className="rounded-card bg-grey-950 focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:not-sr-only focus:px-4 focus:py-2 focus:text-white sr-only"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="content" className="flex-1 px-4 py-8 md:px-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
