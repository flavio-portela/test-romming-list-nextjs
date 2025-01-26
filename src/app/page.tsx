import { promises as fs } from "fs";

import type { Rooming, Event } from "@/app/data-access/bookings";

import SearchHeader from "@/components/SearchHeader";
import RFPCard from "@/components/RFPCard";

export default async function Home() {
  const file = await fs.readFile(
    process.cwd() + "/src/app/data-access/test-data.json",
    "utf-8"
  );
  const data = JSON.parse(file) as Array<Rooming>;

  const events = data.reduce((prev, current) => {
    const eventName = current.drl_rfp.event_name;
    if (!prev[eventName]) {
      prev[eventName] = {
        name: current.drl_rfp.event_name,
        RFPList: [],
      };
    }
    if (prev[eventName]) {
      // We already have this event
      // append to the rfp list
      prev[eventName].RFPList.push({
        agreementType: current.drl_rfp.agreement_type,
        cutoffDate: current.cutoff_date,
        name: current.drl_rfp.event_internal_name,
        totalBookings: current.drl_rooming_list_bookings.length,
        maxBookingDate: new Date().toISOString(),
        minBookingDate: new Date().toISOString(),
        id: current.drl_rfp.rfp_launchpad_id,
        agreementPath: current.drl_rfp.agreement_path,
      });
    }
    return prev;
  }, {} as Record<string, Event>);

  const eventsList = Object.values(events);
  return (
    <div className="min-h-screen bg-(--background) p-10">
      <h3 className="text-2xl font-bold">Rooming List Management: Events</h3>
      <SearchHeader />

      <div className="mt-10 flex gap-10 flex-col">
        {eventsList.map((event) => {
          return (
            <div key={event.name}>
              {event.name}
              <div className="flex overflow-scroll gap-4 snap-x scroll-smooth scroll-pl-30 p-3">
                {event.RFPList.map((rfp) => {
                  return <RFPCard rfp={rfp} key={rfp.id} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
