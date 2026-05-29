

import Navbar from "./components/navbar"
import Hero from "./components/hero"
import HomeMenu from "./components/homemenu"
import SectionBar from "./components/sectionbar"
import Contact from "./components/contact"
import DBConnection from "./utils/config/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";




export async function generateMetadata() {
  return {
    title: "FooDieeWalaa",
    description: "Food Delivery",
  };
}

export default async function Home() {

  await DBConnection();
  return (
    <div>
      <Navbar />
      <Hero />
      <HomeMenu />
      <SectionBar />
      <Contact />
    </div>
  )
}