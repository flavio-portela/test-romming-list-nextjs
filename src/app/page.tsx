import SearchHeader from "@/components/SearchHeader";
import RequestForProposalCard from "@/components/RequestForProposalCard";
import { getEvents } from "@/app/data-access/bookings";

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const events = await getEvents({ search: query });

  return (
    <div className="min-h-screen bg-(--background) p-10">
      <h3 className="text-2xl font-bold">Rooming List Management: Events</h3>
      <SearchHeader />
      <div className="mt-10 flex gap-10 flex-col">
        {events.map((event) => {
          return (
            <div key={event.name}>
              <div className="flex justify-center items-center">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white to-[#00C2A6] ..."></div>
                <span className="py-1 px-2 bg-[#E5F9F6] rounded-md font-bold text-[#00C2A6] border-[#00C2A6] border-2 mx-5 text-sm">
                  {event.name}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00C2A6] to-white ..."></div>
              </div>
              <div className="flex overflow-scroll overflow-y-hidden gap-4 snap-x scroll-smooth scroll-pl-30 p-3">
                {event.RequestForProposalList.map((rfp) => {
                  return <RequestForProposalCard rfp={rfp} key={rfp.id} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
