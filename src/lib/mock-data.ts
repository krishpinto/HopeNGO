export type Role = "admin" | "volunteer" | "event_coordinator";

export interface EventData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  location: string;
  bannerImageUrl: string;
  maxVolunteers: number | null;
  volunteerCount: number;
  maxParticipants: number | null;
  participantCount: number;
  status: "upcoming" | "ongoing" | "completed";
  tags: string[];
  coordinatorId: string | null;
  coordinatorReport?: any;
}

export const MOCK_USERS = [
  { id: "u1", name: "Admin Sarah", email: "sarah@hopengo.org", role: "admin" },
  { id: "u2", name: "Volunteer John", email: "john@example.com", role: "volunteer", isApproved: true },
  { id: "u3", name: "Volunteer Emma", email: "emma@example.com", role: "volunteer", isApproved: false },
  { id: "u4", name: "Coordinator David", email: "david@hopengo.org", role: "event_coordinator" },
];

export const MOCK_EVENTS: EventData[] = [
  {
    id: "e1",
    title: "Annual Global Reforestation Drive",
    description: "Join us in planting 10,000 trees across degraded urban landscapes to restore our local ecosystem.",
    longDescription: "Our flagship Annual Global Reforestation Drive aims to mitigate urban heat islands and restore biodiversity. We will be partnering with local nurseries to plant indigenous saplings over a 10-acre degraded landscape. Gloves, tools, and refreshments will be provided.",
    date: "2026-05-10T10:00:00Z",
    location: "Greenbelt Park, City Center",
    bannerImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 150,
    volunteerCount: 120,
    maxParticipants: 500,
    participantCount: 380,
    status: "upcoming",
    tags: ["Environment", "Tree Plantation"],
    coordinatorId: "u4",
  },
  {
    id: "e2",
    title: "Rural Education Empowerment Camp",
    description: "A free weekend workshop dedicated to bringing digital literacy to underserved rural youth.",
    longDescription: "This three-day immersive camp will introduce rural students to fundamental computer skills, internet navigation, and basic coding constructs. We require volunteers who are patient and proficient in basic IT skills to act as mentors and guides.",
    date: "2026-04-20T09:00:00Z",
    location: "Sunrise Community Hall, Outskirts",
    bannerImageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 25,
    volunteerCount: 25,
    maxParticipants: 100,
    participantCount: 100,
    status: "ongoing",
    tags: ["Education", "Youth"],
    coordinatorId: null,
  },
  {
    id: "e3",
    title: "Riverfront Cleanup Initiative",
    description: "Clear plastic waste from the local riverbank. Join forces to preserve our water bodies.",
    longDescription: "The river is the lifeblood of our city, but recent industrial runoff and municipal waste have severely impacted its health. This initiative aims to manually extract non-biodegradable waste from the banks. All safety gear will be provided.",
    date: "2026-03-15T08:00:00Z",
    location: "Riverfront Pavilion",
    bannerImageUrl: "https://images.unsplash.com/photo-1519821815198-e7c627f1baed?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 50,
    volunteerCount: 48,
    maxParticipants: 200,
    participantCount: 190,
    status: "completed",
    tags: ["Environment", "Cleanup"],
    coordinatorId: "u4",
    coordinatorReport: {
      notes: "Massive success. Collected over 500 bags of trash. High volunteer engagement.",
      attendanceImages: ["https://images.unsplash.com/photo-1555529733-0e67056058e1?auto=format&fit=crop&q=80&w=1000"],
      submittedAt: "2026-03-16T10:00:00Z"
    }
  },
  {
    id: "e4",
    title: "Citywide Blood Donation Camp",
    description: "Urgent blood drive in partnership with City Hospital to replenish emergency banks.",
    longDescription: "Blood reserves are critically low according to recent hospital boards. We are setting up a massive 50-bed donation camp. We need volunteers for registration, donor care (providing refreshments), and queue management. Medical staff will handle the donations.",
    date: "2026-06-01T08:30:00Z",
    location: "Central Municipal Auditorium",
    bannerImageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 30,
    volunteerCount: 12,
    maxParticipants: 1000,
    participantCount: 650,
    status: "upcoming",
    tags: ["Health", "Emergency Response"],
    coordinatorId: "u4",
  },
  {
    id: "e5",
    title: "Women's Financial Literacy Workshop",
    description: "Empowering women from low-income groups with essential financial planning and micro-investment skills.",
    longDescription: "Economic independence is crucial. Through this intensive half-day seminar, guest financial advisors will teach budgeting, savings strategies, and basic investment principles. Volunteers are needed to assist with childcare, registration, and material distribution.",
    date: "2026-05-18T10:00:00Z",
    location: "Women's Welfare Center",
    bannerImageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 15,
    volunteerCount: 8,
    maxParticipants: 80,
    participantCount: 75,
    status: "upcoming",
    tags: ["Empowerment", "Education"],
    coordinatorId: null,
  },
  {
    id: "e6",
    title: "Flood Relief Supply Collection",
    description: "Sorting and packaging donated relief materials for the northern flood-affected zones.",
    longDescription: "Recent flash floods have displaced thousands. We are organizing a massive drive to collect, sort, and dispatch non-perishable food, water, and clothing. Volunteers are expected to perform heavy lifting and meticulous inventory management.",
    date: "2026-04-25T09:00:00Z",
    location: "HopeNGO Logistics Warehouse",
    bannerImageUrl: "https://images.unsplash.com/photo-1593113544332-96cb344dd3e1?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 100,
    volunteerCount: 85,
    maxParticipants: null,
    participantCount: 200,
    status: "upcoming",
    tags: ["Disaster Relief", "Logistics"],
    coordinatorId: "u4",
  },
  {
    id: "e7",
    title: "Menstrual Hygiene Awareness Campaign",
    description: "Breaking the stigma and distributing sanitary kits to underprivileged adolescents.",
    longDescription: "A sensitive and vital campaign to educate young girls on menstrual health and provide them with safe, sustainable hygiene products. Female volunteers are preferred to ensure a comfortable environment for the participants.",
    date: "2026-06-12T11:00:00Z",
    location: "Sector 4 Public School",
    bannerImageUrl: "https://images.unsplash.com/photo-1584308666744-24d5e478544e?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 20,
    volunteerCount: 15,
    maxParticipants: 150,
    participantCount: 120,
    status: "upcoming",
    tags: ["Health", "Women"],
    coordinatorId: null,
  },
  {
    id: "e8",
    title: "Old Age Home Weekend Visit",
    description: "Spend a day sharing stories, playing games, and serving meals to our esteemed elders.",
    longDescription: "A small act of companionship can make a world of difference. We will be spending the entire Sunday at the Silver Oaks Home. Volunteers are encouraged to prepare songs, games, or simple conversational topics.",
    date: "2026-05-02T10:00:00Z",
    location: "Silver Oaks Retirement Home",
    bannerImageUrl: "https://images.unsplash.com/photo-1512415174092-2ee7a1bf2d43?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 20,
    volunteerCount: 20,
    maxParticipants: 40,
    participantCount: 40,
    status: "upcoming",
    tags: ["Eldercare", "Community"],
    coordinatorId: "u4",
  },
  {
    id: "e9",
    title: "Weekly Food Distribution Drive",
    description: "Distributing hot meals to the homeless and daily wage laborers in the downtown district.",
    longDescription: "Our recurring weekend drive focuses on food security. Volunteers will assemble at the community kitchen at 5 AM to pack hot meals, followed by coordinated distribution routes across the city.",
    date: "2026-04-18T06:00:00Z",
    location: "Downtown Community Kitchen",
    bannerImageUrl: "https://images.unsplash.com/photo-1593450942008-54cdebf74b99?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 40,
    volunteerCount: 35,
    maxParticipants: null,
    participantCount: 500,
    status: "upcoming",
    tags: ["Food Security", "Recurring"],
    coordinatorId: null,
  },
  {
    id: "e10",
    title: "Youth Leadership Bootcamp",
    description: "Developing the next generation of social entrepreneurs through a 5-day intense program.",
    longDescription: "Selected high-school students will undergo rigorous training in public speaking, project management, and social impact modeling. Volunteers with corporate or NGO management experience are invited to act as mentors and judges.",
    date: "2026-07-20T09:00:00Z",
    location: "City Innovation Hub",
    bannerImageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 30,
    volunteerCount: 10,
    maxParticipants: 100,
    participantCount: 95,
    status: "upcoming",
    tags: ["Education", "Youth"],
    coordinatorId: "u4",
  },
  {
    id: "e11",
    title: "Community Health & Eye Checkup Camp",
    description: "Free medical screening, cataract testing, and medicine distribution for below-poverty-line families.",
    longDescription: "In partnership with Apollo Clinics, this mega medical camp provides free diagnostics. We need volunteers for crowd management, assisting the elderly, and data entry of medical records.",
    date: "2026-05-22T08:00:00Z",
    location: "Northside Community Ground",
    bannerImageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 60,
    volunteerCount: 40,
    maxParticipants: 800,
    participantCount: 650,
    status: "upcoming",
    tags: ["Health", "Medical"],
    coordinatorId: null,
  },
  {
    id: "e12",
    title: "Public Park Revival Project",
    description: "Painting fences, fixing swings, and planting flower beds to revive a neglected neighborhood park.",
    longDescription: "Urban green spaces are vital for mental health. We are adopting the rundown Maple Park. We'll be removing graffiti, repairing playground equipment, and establishing a small community garden.",
    date: "2026-02-10T09:00:00Z",
    location: "Maple Neighborhood Park",
    bannerImageUrl: "https://images.unsplash.com/photo-1555529902-18c7bc76b1f4?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 80,
    volunteerCount: 75,
    maxParticipants: 100,
    participantCount: 90,
    status: "completed",
    tags: ["Environment", "Community"],
    coordinatorId: "u4",
    coordinatorReport: {
      notes: "The park looks completely transformed. Local residents were extremely grateful. Swings fixed and 200 flowers planted.",
      attendanceImages: ["https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000"],
      submittedAt: "2026-02-11T12:00:00Z"
    }
  }
];

export const MOCK_DONATIONS = [
  { id: "d1", donorName: "Alice Miller", amount: 1500, date: "2026-04-10T14:30:00Z", status: "verified" },
  { id: "d2", donorName: "Bob Smith", amount: 500, date: "2026-04-12T09:15:00Z", status: "verified" },
  { id: "d3", donorName: "Anonymous", amount: 5000, date: "2026-04-14T11:20:00Z", status: "pending" },
  { id: "d4", donorName: "TechCorp Inc.", amount: 10000, date: "2026-04-15T16:45:00Z", status: "verified" },
  { id: "d5", donorName: "Sarah Jenkins", amount: 250, date: "2026-04-16T10:00:00Z", status: "verified" },
  { id: "d6", donorName: "Anonymous", amount: 1000, date: "2026-04-16T12:30:00Z", status: "verified" },
  { id: "d7", donorName: "Green Earth Foundation", amount: 25000, date: "2026-04-17T09:00:00Z", status: "verified" },
];

export const MONTHLY_DONATION_DATA = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 6000 },
  { name: 'Mar', total: 8500 },
  { name: 'Apr', total: 18000 },
  { name: 'May', total: 7500 },
  { name: 'Jun', total: 0 },
];

export const VOLUNTEER_TRENDS_DATA = [
  { name: 'Jan', new: 25, active: 150 },
  { name: 'Feb', new: 40, active: 180 },
  { name: 'Mar', new: 55, active: 220 },
  { name: 'Apr', new: 80, active: 290 },
  { name: 'May', new: 120, active: 380 },
];

export const MOCK_CERTIFICATES = [
  { id: "c1", recipientName: "Volunteer John", eventTitle: "Riverfront Cleanup Initiative", date: "2026-03-16T12:00:00Z" },
  { id: "c2", recipientName: "Volunteer John", eventTitle: "Public Park Revival Project", date: "2026-02-12T09:00:00Z" }
];

export const MOCK_VOLUNTEER_APPLICATIONS = [
  { id: "va1", eventId: "e3", volunteerId: "u2", status: "approved" },
  { id: "va2", eventId: "e12", volunteerId: "u2", status: "approved" },
  { id: "va3", eventId: "e1", volunteerId: "u2", status: "pending" },
];
