export type Role = "admin" | "volunteer" | "event_coordinator";

export const MOCK_USERS = [
  { id: "u1", name: "Admin Sarah", email: "sarah@hopengo.org", role: "admin" },
  { id: "u2", name: "Volunteer John", email: "john@example.com", role: "volunteer", isApproved: true },
  { id: "u3", name: "Volunteer Emma", email: "emma@example.com", role: "volunteer", isApproved: false },
  { id: "u4", name: "Coordinator David", email: "david@hopengo.org", role: "event_coordinator" },
];

export const MOCK_EVENTS = [
  {
    id: "e1",
    title: "Annual Global Reforestation Drive",
    description: "Join us in planting 10,000 trees across degraded urban landscapes to restore our local ecosystem.",
    date: "2026-05-10T10:00:00Z",
    location: "Greenbelt Park, City Center",
    bannerImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 50,
    volunteerCount: 42,
    maxParticipants: 500,
    participantCount: 380,
    status: "upcoming",
    coordinatorId: "u4",
  },
  {
    id: "e2",
    title: "Urban Literacy Workshop",
    description: "A free weekend workshop dedicated to improving adult literacy in underserved neighborhoods.",
    date: "2026-04-20T09:00:00Z",
    location: "Community Center Library",
    bannerImageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 15,
    volunteerCount: 15,
    maxParticipants: 100,
    participantCount: 100,
    status: "ongoing",
    coordinatorId: null,
  },
  {
    id: "e3",
    title: "Clean Water Initiative Launch",
    description: "Launch event for our new water purification project. Information session and local river cleanup.",
    date: "2026-03-15T08:00:00Z",
    location: "Riverfront Pavilion",
    bannerImageUrl: "https://images.unsplash.com/photo-1519821815198-e7c627f1baed?auto=format&fit=crop&q=80&w=1000",
    maxVolunteers: 30,
    volunteerCount: 28,
    maxParticipants: 200,
    participantCount: 190,
    status: "completed",
    coordinatorId: "u4",
    coordinatorReport: {
      notes: "Event went extremely well. Weather was perfect and we collected 500 bags of waste from the riverbank.",
      attendanceImages: ["https://images.unsplash.com/photo-1555529733-0e67056058e1?auto=format&fit=crop&q=80&w=1000"],
      submittedAt: "2026-03-16T10:00:00Z"
    }
  }
];

export const MOCK_DONATIONS = [
  { id: "d1", donorName: "Alice Miller", amount: 1500, date: "2026-04-10T14:30:00Z", status: "verified" },
  { id: "d2", donorName: "Bob Smith", amount: 500, date: "2026-04-12T09:15:00Z", status: "verified" },
  { id: "d3", donorName: "Anonymous", amount: 5000, date: "2026-04-14T11:20:00Z", status: "pending" },
  { id: "d4", donorName: "TechCorp Inc.", amount: 10000, date: "2026-04-15T16:45:00Z", status: "verified" },
];

export const MONTHLY_DONATION_DATA = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 6000 },
  { name: 'Mar', total: 8500 },
  { name: 'Apr', total: 12000 },
  { name: 'May', total: 5000 },
  { name: 'Jun', total: 0 },
];

export const VOLUNTEER_TRENDS_DATA = [
  { name: 'Jan', new: 10, active: 50 },
  { name: 'Feb', new: 15, active: 62 },
  { name: 'Mar', new: 25, active: 85 },
  { name: 'Apr', new: 30, active: 110 },
];

export const MOCK_VOLUNTEER_APPLICATIONS = [
  { id: "a1", eventId: "e1", volunteerId: "u2", volunteerName: "Volunteer John", status: "approved" },
  { id: "a2", eventId: "e2", volunteerId: "u3", volunteerName: "Volunteer Emma", status: "pending" },
];

export const MOCK_CERTIFICATES = [
  { id: "c1", recipientName: "Volunteer John", eventTitle: "Clean Water Initiative Launch", date: "2026-03-16T12:00:00Z" }
];
