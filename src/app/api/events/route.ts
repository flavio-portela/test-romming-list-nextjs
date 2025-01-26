import { promises as fs } from "fs";
import type { Rooming, ParsedEvent } from "@/app/data-access/bookings.types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const events = await getEvents({
    search,
  });
  return NextResponse.json(events);
}

async function getEvents({ search = "" }: { search: string }) {
  const file = await fs.readFile(
    process.cwd() + "/src/app/data-access/test-data.json",
    "utf-8"
  );
  const data = JSON.parse(file) as Array<Rooming>;

  const events = data.reduce((events, current) => {
    const eventName = current.drl_rfp.event_name;

    if (!events[eventName]) {
      events[eventName] = {
        name: current.drl_rfp.event_name,
        RequestForProposalList: [],
      };
    }
    if (events[eventName]) {
      // We already have this event
      // append to the rfp list
      events[eventName].RequestForProposalList.push({
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
    return events;
  }, {} as Record<string, ParsedEvent>);

  const eventsList = Object.values(events);

  // filter events
  if (search) {
    // first filter RFPs
    let RFPMatch = false; // flag to tell if a search term matched any RFP
    let filteredEvents = eventsList.map((event) => {
      const RFPs = event.RequestForProposalList.filter((rfp) => {
        const match =
          rfp.name.toLowerCase().includes(search) ||
          rfp.cutoffDate.toLowerCase().includes(search) ||
          rfp.agreementType.toLowerCase().includes(search);
        if (match) {
          RFPMatch = true;
        }
        return match;
      });

      if (RFPMatch) {
        event.RequestForProposalList = RFPs;
      }

      return event;
    });

    // remove events that do not include any RFPs
    if (RFPMatch) {
      filteredEvents = filteredEvents.filter((event) => {
        return event.RequestForProposalList.length > 0;
      });
    }

    // If the search term does not matches any RFP then try to filter by event name
    if (!RFPMatch) {
      filteredEvents = filteredEvents.filter((event) => {
        return event.name.toLowerCase().includes(search);
      });
    }

    return filteredEvents;
  }

  return eventsList;
}
