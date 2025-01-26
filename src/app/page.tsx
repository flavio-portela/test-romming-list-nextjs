import { getEvents } from "@/app/data-access/bookings";

import SearchHeader from "@/components/SearchHeader";
import RequestForProposalCard from "@/components/RequestForPropsalCard";

export default async function Home() {
  const eventsList = await getEvents();
  return (
    <div className="min-h-screen bg-(--background) p-10">
      <h3 className="text-2xl font-bold">Rooming List Management: Events</h3>
      <SearchHeader />
      <div className="mt-10 flex gap-10 flex-col">
        {eventsList.map((event) => {
          return (
            <div key={event.name}>
              <div className="flex justify-center items-center">
                <div className="h-1 flex-1 bg-gradient-to-r from-white to-green-700 ..."></div>
                <span className="py-1 px-2 bg-green-200 rounded-md font-bold text-green-700 border-green-700 border-2 mx-5">
                  {event.name}
                </span>
                <div className="h-1 flex-1 bg-gradient-to-r from-green-700 to-white ..."></div>
              </div>
              <div className="flex overflow-scroll gap-4 snap-x scroll-smooth scroll-pl-30 p-3">
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
