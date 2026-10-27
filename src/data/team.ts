// NOTE: This is a SAMPLE data structure to be populated per cafe. Real team members will be listed here.

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "rohan-sharma",
    name: "Rohan Sharma",
    role: "Head Roaster & Barista",
    photo: "/images/team/rohan-barista.jpg",
    bio: "Oversees green bean sourcing and daily espresso extraction profiles.",
  },
  {
    id: "ananya-verma",
    name: "Ananya Verma",
    role: "Head Baker",
    photo: "/images/team/ananya-baker.jpg",
    bio: "Manages our 36-hour sourdough fermentation and morning pastry lamination.",
  },
  {
    id: "kabir-mehta",
    name: "Kabir Mehta",
    role: "Hospitality Lead",
    photo: "/images/team/kabir-hospitality.jpg",
    bio: "Welcomes visitors, guides coffee tastings, and manages counter service.",
  },
];
