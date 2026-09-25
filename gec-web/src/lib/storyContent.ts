import type { Story } from './types';

type StoryContent = Pick<Story, 'body' | 'pullQuote' | 'metrics'>;

/**
 * Long-form copy for the three frozen stories, keyed by slug so it also attaches to
 * CMS stories that arrive without a body. ponytail: draft editorial copy built from each
 * story's excerpt — have the founders fact-check names, figures and dates before launch.
 */
const STORY_CONTENT: Record<string, StoryContent> = {
  'from-campus-project-to-seed-funding': {
    metrics: [
      { value: '₹75L', label: 'Pre-seed raised' },
      { value: '3', label: 'Founders, all undergrads' },
      { value: '14 wks', label: 'First pitch to close' },
      { value: '2', label: 'Paid pilots before the round' },
    ],
    pullQuote: {
      text: 'Nobody funded the drone. They funded the fourteen delivery logs we had from the campus pharmacy.',
      by: 'Rohan Verma, co-founder, AeroDynamics AI',
    },
    body: [
      {
        paragraphs: [
          'AeroDynamics AI started as a third-year robotics assignment that refused to end. Rohan Verma and two classmates had built a quadcopter that could hold a line across the Galgotias sports ground, and one of them asked the obvious next question: could it carry something useful across campus faster than a person on foot?',
          'The first payload was a strip of paracetamol from the campus pharmacy to the hostel medical room, a 1.4 km walk that took eleven minutes on a good day. The drone did it in four. It also crashed into a neem tree on its third attempt, which the team still keeps a photo of above their desk.',
        ],
      },
      {
        heading: 'From assignment to pilot',
        paragraphs: [
          'The team joined the GEC Startup Development Program in Cohort 02. Their mentor’s first note was blunt: stop improving the airframe and start logging deliveries. For six weeks, every flight produced a record of distance, battery drop, wind speed and whether the package arrived intact.',
          'Those logs turned into two paid pilots: a diagnostics lab in Greater Noida moving blood samples between collection centres, and a hardware store shipping small spare parts to construction sites. Neither contract was large, but together they showed a pattern investors could underwrite.',
        ],
      },
      {
        heading: 'The round',
        paragraphs: [
          'GICRISE introduced the founders to its angel network during demo week. The first eight conversations went nowhere. The pitch was a flying robot; the questions were about airspace permissions, insurance and unit economics. The team rebuilt the deck around cost per delivery instead, and put the DGCA green-zone map on slide two.',
          'Fourteen weeks after the first investor meeting, AeroDynamics AI closed ₹75 lakh from a syndicate of four angels. The founders kept their seats in class: two of them sat end-term exams during the week the term sheet was signed.',
        ],
      },
      {
        heading: 'What they’d tell Cohort 04',
        paragraphs: [
          'Log everything from the first day, even when it feels pointless. Find one customer who will pay a small amount before you ask anyone for a large one. And book the incubator’s legal clinic before you need it; their shareholder agreement went through three drafts there, and no investor asked for a fourth.',
        ],
      },
    ],
  },

  'northern-india-biggest-student-venture-summit': {
    metrics: [
      { value: '5,000+', label: 'Delegates expected' },
      { value: '60+', label: 'Venture partners' },
      { value: '12', label: 'Keynotes' },
      { value: '₹12L', label: 'Pitch Arena grant pool' },
    ],
    pullQuote: {
      text: 'We didn’t want a conference you watch. We wanted one you leave with a co-founder, a mentor or a cheque.',
      by: 'E-Summit 2026 organising committee',
    },
    body: [
      {
        paragraphs: [
          'Galgotias Entrepreneurship Cell has confirmed E-Summit 2026, its flagship student venture conclave, on the Galgotias University campus in Greater Noida. The one-day summit runs across the Main Auditorium and the Pitch Arena from 09:30 to 18:00, and entry is free for students with a valid college ID.',
        ],
      },
      {
        heading: 'Two stages, one day',
        paragraphs: [
          'The Main Stage carries twelve keynotes and a founder fireside, with operators speaking on hiring, distribution and fundraising rather than inspiration alone. The Pitch Arena runs in parallel: twenty shortlisted student teams pitch in two rounds before an angel panel, and five finalists compete for a ₹12 lakh grant pool.',
          'Between sessions, the Campus Hub expo floor hosts stalls from student ventures in the GEC and GICRISE pipeline, and visiting investors hold fifteen-minute office hours that delegates can book on the day.',
        ],
      },
      {
        heading: 'Who should come',
        paragraphs: [
          'First-years who have never pitched anything are as welcome as teams already selling. The organisers have kept most sessions practical on purpose: how to run a customer interview, how to read a term sheet, how to split equity with a friend without losing the friendship.',
          'Teams that want to pitch should apply through the SDP and Ideathon tracks on the Initiatives page; shortlisted teams will be told a week before the summit.',
        ],
      },
    ],
  },

  'patent-filing-and-ip-for-student-builders': {
    metrics: [
      { value: '4', label: 'Provisional patents filed' },
      { value: '₹0', label: 'Cost to the student teams' },
      { value: '12 mo', label: 'Priority window secured' },
    ],
    pullQuote: {
      text: 'The cheapest time to protect an idea is the week before you show it to a room full of investors.',
      by: 'GEC IP clinic mentor',
    },
    body: [
      {
        paragraphs: [
          'Demo days are a strange moment for a student founder: the more convincingly you explain your invention, the more of it you have given away. This year, four ventures from the GEC pipeline walked into their demo days with provisional patents already on file, at no cost to the teams.',
        ],
      },
      {
        heading: 'How the clinic works',
        paragraphs: [
          'The IP clinic runs through GEC and GICRISE. Teams book a thirty-minute intake where a mentor asks one question first: what exactly is new here? Most ideas fail that test honestly, and the clinic says so, which saves weeks of drafting for protection that would never hold.',
          'For ideas that pass, the clinic helps the team write a clear technical description, draw the key diagrams and prepare a provisional application. A provisional filing gives the team a twelve-month priority date to build, test and raise before committing to a full, expensive patent.',
        ],
      },
      {
        heading: 'The four filings',
        paragraphs: [
          'This cycle’s filings cover a low-cost soil moisture probe, a computer-vision method for sorting recyclable plastics, a rapid blood-analysis sensor for small clinics, and a drone payload release mechanism. All four teams are in, or have graduated from, the Startup Development Program.',
        ],
      },
      {
        heading: 'Before you file',
        paragraphs: [
          'Don’t post detailed build videos or open-source the core method before talking to the clinic. Keep dated notebooks or commits of your work. And write down who contributed what; inventorship disputes between friends are the most common reason a filing stalls.',
        ],
      },
    ],
  },
};

/** Merge long-form copy into a story by slug; stories without an entry pass through untouched. */
export function withStoryContent(story: Story): Story {
  const extra = STORY_CONTENT[story.slug];
  return extra ? { ...extra, ...story, body: story.body ?? extra.body } : story;
}
