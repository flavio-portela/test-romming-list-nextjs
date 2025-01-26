import SearchHeader from "@/components/organisms/SearchHeader";
import { getEvents } from "@/app/data-access/bookings";
import EventRooming from "@/components/organisms/EventRooming";

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    filters?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const filters = searchParams?.filters?.split(",") || [];

  const events = await getEvents({ search: query, filters });

  return (
    <div className="min-h-screen bg-(--background) p-10">
      <h3 className="text-2xl font-bold">Rooming List Management: Events</h3>
      <SearchHeader />
      <EventRooming events={events} />
    </div>
  );
}
