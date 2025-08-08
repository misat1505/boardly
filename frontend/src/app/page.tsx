import HeaderSection from "@/components/home/HeaderSection";
import HomeNavbar from "@/components/home/HomeNavbar";

export default async function Home() {
  return (
    <div>
      <HomeNavbar />
      <HeaderSection />
      <div className="h-[100rem]" />
    </div>
  );
}
