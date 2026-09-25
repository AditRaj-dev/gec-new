// Vertical portrait cards on an infinite trail. Drop a portrait into
// public/speakers/ and set `photo` on the entry; until then the frame shows initials.
export type Speaker = { initials: string; name: string; role: string; org: string; photo?: string };

export const SPEAKERS_FALLBACK: Speaker[] = [
  { initials: 'AG', name: 'Ashneer Grover', role: 'Co-Founder', org: 'BharatPe' },
  { initials: 'AG', name: 'Aman Gupta', role: 'Co-Founder & CMO', org: 'boAt Lifestyle' },
  { initials: 'SJ', name: 'Sandeep Jain', role: 'Founder & CEO', org: 'GeeksforGeeks' },
  { initials: 'SB', name: 'Sanjeev Bikhchandani', role: 'Founder & Vice Chairman', org: 'Info Edge / Naukri.com' },
  { initials: 'DS', name: 'Debojit Sen', role: 'Founder', org: 'Crack-ED' },
  { initials: 'HA', name: 'Himanshu Adlakha', role: 'Co-Founder', org: 'Winston India' },
  { initials: 'IS', name: 'Ishant Sachdeva', role: 'Founder', org: 'Being Chief' },
  { initials: 'TV', name: 'Tushar Vadera', role: 'Founding Member', org: 'Zomato Feeding India' },
];
