import HeaderSection from "@/components/home/HeaderSection";
import HeroSection from "@/components/home/HeroSection";
import HomeNavbar from "@/components/home/HomeNavbar";

export default async function Home() {
  return (
    <div>
      <HomeNavbar />
      <HeaderSection />
      <HeroSection />
      <div className="h-[100rem]" />
    </div>
  );
}
