import { getCurrentUser } from "@/actions/user/getCurrentUser";
import BelowHeroSection from "@/components/home/BelowHeroSection";
import HeaderSection from "@/components/home/HeaderSection";
import HeroSection from "@/components/home/HeroSection";
import HomeFooter from "@/components/home/HomeFooter";
import HomeNavbar from "@/components/home/HomeNavbar";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div>
      <HomeNavbar user={user} />
      <HeaderSection />
      <HeroSection />
      <BelowHeroSection user={user} />
      <HomeFooter />
    </div>
  );
}
