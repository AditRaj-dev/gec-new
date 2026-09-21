import { getStakeholders, getStories } from "@/lib/public-content";
import { StoriesDirectory } from "./_components/stories-directory";
export default async function StoriesPage() { const [stories, stakeholders] = await Promise.all([getStories(), getStakeholders("startup")]); return <StoriesDirectory stories={stories} startups={stakeholders} />; }
