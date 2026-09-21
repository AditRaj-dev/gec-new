export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Teams", href: "/teams" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Stories", href: "/stories" },
] as const;

export interface HeroCampaignData {
  campaign: string; statusTag: string; statusClass: string; priority: string;
  headline: string; subline: string; deadline: string; context: string;
  primaryCta: string; primaryActionTarget: string; secondaryCta: string;
  secondaryRoute: string; mediaTitle: string; mediaSubtitle: string;
  mediaChips: string[]; secondaryCardId: string | null;
}

export const HERO_SPOTLIGHT_DATA: Record<string, HeroCampaignData> = {
  sdp: { campaign: "Startup Development Program", statusTag: "Applications open", statusClass: "accent-crimson", priority: "Flagship initiative", headline: "STARTUP DEVELOPMENT PROGRAM", subline: "Have an idea? Let’s see how far you can take it.", deadline: "Applications close soon", context: "A guided venture-building sprint with mentors, practical workshops, and room to test an idea with real people.", primaryCta: "Apply for the program", primaryActionTarget: "Startup Development Program", secondaryCta: "Explore the program", secondaryRoute: "/initiatives", mediaTitle: "A room for ideas in motion", mediaSubtitle: "Use a campaign image or short muted loop when one is available.", mediaChips: ["Mentorship", "Prototype", "Pitch"], secondaryCardId: "sdp" },
  ideathon: { campaign: "Ideathon", statusTag: "Venture sprint", statusClass: "accent-crimson", priority: "Major program", headline: "BUILD A BOLD FIRST VERSION", subline: "Bring a problem worth solving and a team ready to learn.", deadline: "Check the current application window", context: "A focused sprint for student teams to explore a problem, shape a solution, and share what they learned.", primaryCta: "See current initiatives", primaryActionTarget: "Ideathon", secondaryCta: "View initiatives", secondaryRoute: "/initiatives", mediaTitle: "Ideas become visible when teams build", mediaSubtitle: "A static poster or campaign motion can live beside the editorial copy.", mediaChips: ["Explore", "Prototype", "Share"], secondaryCardId: "ideathon" },
  esummit: { campaign: "GEC E-Summit", statusTag: "Founder conversations", statusClass: "accent-gold", priority: "Community event", headline: "CONVERSATIONS THAT MOVE BUILDERS", subline: "Meet the people making entrepreneurship feel possible.", deadline: "Follow the latest event updates", context: "Founder talks, student showcases, and useful conversations for people curious about building something of their own.", primaryCta: "Explore stories", primaryActionTarget: "GEC E-Summit", secondaryCta: "Read the stories", secondaryRoute: "/stories", mediaTitle: "A stage for practical lessons", mediaSubtitle: "Swap in the current event artwork when the CMS publishes it.", mediaChips: ["Founders", "Community", "Learning"], secondaryCardId: "esummit" },
  evergreen: { campaign: "Galgotias Entrepreneurship Cell", statusTag: "Student-led entrepreneurship", statusClass: "accent-blue", priority: "Evergreen", headline: "IDEAS BEGIN HERE. BUILDERS GROW HERE.", subline: "Innovate. Inspire. Impact.", deadline: "Open to curious builders", context: "A student-driven community where ideas are explored, skills are built, and aspiring founders find the people and opportunities to take their next step.", primaryCta: "Explore initiatives", primaryActionTarget: "General E-Cell Membership", secondaryCta: "Discover GEC", secondaryRoute: "/about", mediaTitle: "There is room to begin", mediaSubtitle: "A warm editorial image can replace this fallback without changing the layout.", mediaChips: ["Ideas", "People", "Progress"], secondaryCardId: null },
};

export const happenings = [
  { label: "Upcoming event", title: "A founder conversation is taking shape", copy: "Hear practical lessons from people who have tested an idea, changed direction, and kept building.", dateBadge: "Updates shared as details are confirmed", href: "/stories", accent: "crimson" },
  { label: "Applications open", title: "Startup Development Program", copy: "A guided sprint for students ready to move from a promising question to a clearer first version.", statusBadge: "Explore the current cohort", href: "/initiatives", accent: "gold" },
  { label: "Latest story", title: "Founders in the making", copy: "Field notes from students learning through customer conversations, prototypes, and honest feedback.", href: "/stories", accent: "blue" },
  { label: "Startup spotlight", title: "From campus question to first experiment", copy: "Discover the early moves, decisions, and collaborators behind ventures emerging from the community.", href: "/stories", accent: "ink" },
] as const;

export interface InitiativeItem { number: string; title: string; badge: string; summary: string; audience: string; format: string; desc: string; route: string; applyTitle: string; }
export const initiatives: InitiativeItem[] = [
  { number: "01", title: "Startup Development Program", badge: "Applications open", summary: "A guided venture-building sprint for students moving from an early idea toward a tested first version.", audience: "Aspiring founders and early student builder teams", format: "Sprint · Mentorship · Demo practice", desc: "A practical pre-incubation space for customer discovery, prototyping, feedback, and founder growth.", route: "/initiatives/sdp-cohort-04", applyTitle: "Startup Development Program" },
  { number: "02", title: "Monthly Pitch Sessions", badge: "Ongoing series", summary: "A room to share a venture, receive direct questions, and leave with a sharper next step.", audience: "Teams with a prototype, proof of concept, or early traction", format: "Pitch practice · Feedback · Connections", desc: "Closed-room pitch practice that helps student teams clarify their story and pressure-test their assumptions.", route: "/initiatives/pitch-sessions", applyTitle: "Monthly Pitch Sessions" },
  { number: "03", title: "Entrepreneurship Bootcamps", badge: "Hands-on learning", summary: "Workshops that turn entrepreneurship from an abstract idea into a set of things you can practice.", audience: "Curious students at every starting point", format: "Workshops · Peer learning · Labs", desc: "Practical sessions on customer discovery, prototyping, storytelling, and the craft of building with a team.", route: "/initiatives/bootcamps-workshops", applyTitle: "Entrepreneurship Bootcamps" },
];

export interface TeamPillar { name: string; desc: string; }
export interface TeamItem { number: string; name: string; badge: string; route: string; headline: string; description: string; headName: string; headRole: string; headTag: string; applyTarget: string; accentColor: string; focus: string[]; pillars: TeamPillar[]; responsibilities?: string[]; recruitment?: string; }
const teamSeed = [
  ["Startup Development & Incubation", "Turning raw student ideas into viable ventures.", "Aarav Sharma", "#FBCA05"], ["PR & Networking", "Building relationships that expand possibilities.", "Ananya Roy", "#A3040F"], ["Marketing & Campus Ambassador", "Taking GEC beyond the room.", "Kabir Mehta", "#F97316"], ["Event Management & Operations", "Turning plans into experiences.", "Vikram Malhotra", "#701A24"], ["Digital Media & Storytelling", "Making the work visible.", "Priya Iyer", "#1F7EC0"], ["Technical & Product Lab", "Technology behind the ecosystem.", "Siddharth Nair", "#334155"], ["Internship & Career Connect", "Connecting talent with opportunity.", "Ishaan Gupta", "#854D0E"],
] as const;
export const teams: TeamItem[] = teamSeed.map(([name, headline, headName, accentColor], index) => ({ number: String(index + 1).padStart(2, "0"), name, badge: name, route: `/teams/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, headline, description: `The ${name} team creates useful opportunities, clear systems, and thoughtful experiences for the GEC community.`, headName, headRole: `Team lead · ${name}`, headTag: headName, applyTarget: name, accentColor, focus: ["Planning", "Collaboration", "Execution", "Community"], responsibilities: ["Build clear systems", "Create useful opportunities", "Share what the work teaches"], recruitment: "Join a team that turns intention into action.", pillars: [{ name: "Build", desc: "Turn a useful question into a visible first step." }, { name: "Connect", desc: "Create the relationships that help a community move." }, { name: "Learn", desc: "Reflect, adapt, and share what the work teaches." }] }));

export const storyCategories = ["All", "News", "Founders", "Startups", "Events", "Startup Portfolio"] as const;
export const stories = [
  { category: "Founders", title: "Founders in the Making", excerpt: "How student builders turn an early question into a set of experiments, conversations, and decisions.", meta: "Founder story", tone: "crimson", quote: "The first version became clearer once we started listening to people outside the room.", isFeatured: true },
  { category: "Startups", title: "The 0-to-1 Field Guide", excerpt: "A practical look at customer discovery, early prototypes, and the discipline of learning before scaling.", meta: "Field notes", tone: "gold", quote: "Progress is often a better question, not a louder answer.", isFeatured: false },
  { category: "News", title: "Building the GEC ecosystem", excerpt: "Notes from the people and programs creating more room for students to explore entrepreneurship.", meta: "From GEC", tone: "blue", quote: "A healthy ecosystem gives an idea more than one place to go next.", isFeatured: false },
  { category: "Events", title: "Inside the pitch room", excerpt: "What happens when a student team shares its work, welcomes hard questions, and leaves with a sharper path.", meta: "Event story", tone: "ink", quote: "Useful feedback is specific enough to change what you do tomorrow.", isFeatured: false },
] as const;

export interface StartupPortfolioItem { name: string; sector: "tech" | "consumer" | "health" | "sustainability"; sectorLabel: string; stageBadge: string; stageClass: string; description: string; tag: string; url: string; }
export const STARTUP_PORTFOLIO: StartupPortfolioItem[] = [
  { name: "CloudScale AI", sector: "tech", sectorLabel: "Tech", stageBadge: "Early stage", stageClass: "role-crimson", description: "Developer workflow tools shaped through student experimentation.", tag: "TECH", url: "https://cloudscale.ai" },
  { name: "NutriBrews", sector: "consumer", sectorLabel: "Consumer", stageBadge: "Early stage", stageClass: "role-gold", description: "A clean-label beverage concept exploring everyday wellness.", tag: "D2C", url: "https://nutribrews.in" },
  { name: "MediKit AI", sector: "health", sectorLabel: "Health", stageBadge: "In exploration", stageClass: "role-crimson", description: "A clinic workflow concept designed around simpler triage and care coordination.", tag: "HLTH", url: "https://medikit.ai" },
  { name: "EcoPack Solutions", sector: "sustainability", sectorLabel: "Sustainability", stageBadge: "In exploration", stageClass: "role-gold", description: "Packaging experiments using agricultural waste and circular material thinking.", tag: "SUST", url: "https://ecopack.co" },
];

export const SPEAKERS = [
  { name: "Ashneer Grover", org: "Founder and operator", role: "Founder" }, { name: "Aman Gupta", org: "Consumer brand builder", role: "D2C pioneer" }, { name: "Debojit Sen", org: "Startup ecosystem mentor", role: "Mentor" }, { name: "Himanshu Adlakha", org: "Founder and investor", role: "Founder" }, { name: "Ishant Sachdeva", org: "Startup ecosystem mentor", role: "Mentor" }, { name: "Tushar Vadera", org: "Product and growth leader", role: "Builder" }, { name: "Sandeep Jain", org: "Technology educator", role: "Builder" }, { name: "Sanjeev Bikhchandani", org: "Technology investor", role: "Investor" },
] as const;

export const PEOPLE = [
  { id: "person-president", name: "Student President", category: "leadership", roleTitle: "GEC Executive Board", bio: "A student representative helping the community move with purpose.", socialLinks: {} },
  { id: "person-vice-president", name: "Student Vice President", category: "leadership", roleTitle: "Operations and strategy", bio: "Supporting the teams, programs, and rhythms that make participation possible.", socialLinks: {} },
  { id: "person-secretary", name: "General Secretary", category: "leadership", roleTitle: "Administration and protocol", bio: "Keeping the community coordinated, welcoming, and ready to act.", socialLinks: {} },
  { id: "person-mentor-network", name: "Founder mentor network", category: "mentors", roleTitle: "Founder and operator mentors", bio: "Practitioners who share the questions, patterns, and lessons behind building.", socialLinks: {} },
  { id: "person-incubation-team", name: "GICRISE incubation team", category: "mentors", roleTitle: "Incubation advisors", bio: "Connecting student energy with a wider innovation and incubation ecosystem.", socialLinks: {} },
] as const;

export const PARTNERS = [
  { name: "GICRISE", org: "Incubation and innovation ecosystem" }, { name: "Mentor network", org: "Founders and practitioners" }, { name: "Campus community", org: "Student collaborators" }, { name: "Industry partners", org: "Pathways into practice" }, { name: "Alumni builders", org: "Experience shared forward" }, { name: "Founder community", org: "People building in public" },
] as const;
export const STAKEHOLDERS = [
  ...PARTNERS.map((partner, index) => ({ id: `partner-${index + 1}`, name: partner.name, type: "partner" as const, designation: partner.org, websiteUrl: undefined, description: partner.org, metadata: {} })),
  ...SPEAKERS.map((speaker, index) => ({ id: `speaker-${index + 1}`, name: speaker.name, type: "speaker" as const, designation: speaker.org, websiteUrl: undefined, description: speaker.role, metadata: {} })),
  { id: "startup-cloudscale-ai", name: "CloudScale AI", type: "startup" as const, designation: "Tech", websiteUrl: "https://cloudscale.ai", description: "Developer workflow tools shaped through student experimentation.", metadata: { sector: "tech" } },
  { id: "startup-nutribrews", name: "NutriBrews", type: "startup" as const, designation: "Consumer", websiteUrl: "https://nutribrews.in", description: "A clean-label beverage concept exploring everyday wellness.", metadata: { sector: "consumer" } },
  { id: "startup-medikit-ai", name: "MediKit AI", type: "startup" as const, designation: "Health", websiteUrl: "https://medikit.ai", description: "A clinic workflow concept designed around simpler triage and care coordination.", metadata: { sector: "health" } },
  { id: "startup-ecopack", name: "EcoPack Solutions", type: "startup" as const, designation: "Sustainability", websiteUrl: "https://ecopack.co", description: "Packaging experiments using agricultural waste and circular material thinking.", metadata: { sector: "sustainability" } },
] as const;
export const MILESTONES = [
  { year: "Foundation", title: "From curiosity to community", summary: "Students began creating a shared space to ask better questions about entrepreneurship." }, { year: "Growth", title: "More rooms to build", summary: "Programs, events, and founder conversations widened the ways students could participate." }, { year: "Next", title: "A stronger path forward", summary: "GEC continues to connect student energy with mentors, collaborators, and meaningful opportunities." },
] as const;
export const LEADERSHIP_ROSTER = { tier1: [{ role: "President", name: "Student President", dept: "GEC Executive Board" }, { role: "Vice President", name: "Student Vice President", dept: "Operations and strategy" }, { role: "Secretary", name: "General Secretary", dept: "Administration and protocol" }], tier2: [{ role: "GICRISE", name: "Incubation team", dept: "Incubation advisory" }, { role: "Mentors", name: "Founder network", dept: "Venture mentorship" }, { role: "Community", name: "Team leads", dept: "Ecosystem outreach" }] } as const;
export const impactAreas = ["Leadership", "Communication", "Teamwork", "Ideation", "Problem solving", "Execution"] as const;
export const ecosystemActions = ["Explore an idea with peers who challenge assumptions.", "Join workshops that translate theory into working experiments.", "Learn with mentors, founders, and the wider GICRISE ecosystem.", "Lead a team and experience what it takes to execute on the ground."] as const;
