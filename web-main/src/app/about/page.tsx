import { getPeople } from "@/lib/public-content";
import { AboutContent } from "./_components/about-content";

export default async function AboutPage() {
  const people = await getPeople();
  return <AboutContent people={people} />;
}
