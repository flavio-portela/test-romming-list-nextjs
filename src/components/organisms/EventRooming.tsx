import type { ParsedEvent } from "@/app/data-access/bookings.types";
import RequestForProposalCard from "@/components/molecules/RequestForProposalCard";

interface EventRoomingProps {
  events: ParsedEvent[];
}

const EventRooming = ({ events }: EventRoomingProps) => {
  return (
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
  );
};

export default EventRooming;
