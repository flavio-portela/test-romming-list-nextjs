import { promises as fs } from "fs";
import type { Rooming, Event } from "@/app/data-access/bookings.types";

export async function getEvents() {
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
        RequestForProposalList: [],
      };
    }
    if (prev[eventName]) {
      // We already have this event
      // append to the rfp list
      prev[eventName].RequestForProposalList.push({
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
  return eventsList;
}
