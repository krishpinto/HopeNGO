import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/lib/mock-data";

export default function LandingPage() {
  const featuredEvents = MOCK_EVENTS.slice(0, 2);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32 lg:py-40 bg-surface flex items-center justify-center overflow-hidden">
        <div className="container mx-auto relative z-10 max-w-5xl">
          <div className="max-w-3xl space-y-8">
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
              Preserving <span className="text-primary italic">nature</span> & <span className="text-primary italic">community</span> for future generations.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              HopeNGO is a non-profit organization dedicated to creating sustainable, 
              community-driven solutions for urban ecosystems and underserved neighborhoods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/events" className={buttonVariants({ size: "lg", className: "rounded-full px-8 text-base shadow-xl shadow-primary/10" })}>
                Explore Events
              </Link>
              <Link href="/donations" className={buttonVariants({ variant: "secondary", size: "lg", className: "rounded-full px-8 text-base bg-secondary text-secondary-foreground hover:bg-secondary/80" })}>
                Make a Donation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-surface-container-low py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-transparent md:divide-border/20">
            <div className="flex flex-col sm:items-center text-left sm:text-center space-y-2">
              <span className="font-heading text-4xl md:text-5xl text-primary font-bold">10k+</span>
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Trees Planted</span>
            </div>
            <div className="flex flex-col sm:items-center text-left sm:text-center space-y-2">
              <span className="font-heading text-4xl md:text-5xl text-primary font-bold">500+</span>
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Active Volunteers</span>
            </div>
            <div className="flex flex-col sm:items-center text-left sm:text-center space-y-2">
              <span className="font-heading text-4xl md:text-5xl text-primary font-bold">250</span>
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Events Hosted</span>
            </div>
            <div className="flex flex-col sm:items-center text-left sm:text-center space-y-2">
              <span className="font-heading text-4xl md:text-5xl text-primary font-bold">50+</span>
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Communities Served</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Upcoming Initiatives</h2>
              <p className="text-muted-foreground max-w-xl">Join us in the field. Volunteer or participate in our latest community-driven events.</p>
            </div>
            <Link href="/events" className={buttonVariants({ variant: "link", className: "text-primary hidden md:inline-flex" })}>
              View all events &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 block">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.bannerImageUrl} alt={event.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-muted-foreground">{event.location}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
