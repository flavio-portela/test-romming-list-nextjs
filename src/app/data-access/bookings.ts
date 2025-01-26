import { promises as fs } from "fs";
import type {
  Rooming,
  ParsedEvent,
  Booking,
} from "@/app/data-access/bookings.types";
import { format, fromUnixTime, getUnixTime } from "date-fns";

export async function getEvents({
  search = "",
  filters = [],
}: {
  search: string;
  filters: string[];
}) {
  const eventsList = await getParsedEvents();
  return filterEventsWithoutRFP(
    filterBySearchTerm(
      filterByStatus(eventsList, filters),
      search.toLowerCase()
    )
  );
}
function filterEventsWithoutRFP(events: ParsedEvent[]): ParsedEvent[] {
  return events.filter((event) => {
    return event.RequestForProposalList.length > 0;
  });
}

function filterBySearchTerm(
  events: ParsedEvent[],
  search: string
): ParsedEvent[] {
  if (!search) {
    return events;
  }
  // See if we have a match by event name
  const filteredByEventName = events.filter((event) => {
    return event.name.toLowerCase().includes(search);
  });

  // found an event(s) with a name matching the search
  // return those events with all their RFPs
  if (filteredByEventName.length) {
    return filteredByEventName;
  }

  // filter RFPs
  return events.map((event) => {
    event.RequestForProposalList = event.RequestForProposalList.filter(
      (rfp) => {
        // Get dates
        const cutOffDateStr = format(rfp.cutoffDate, "MMM d");
        const minBookingDateStr = format(rfp.minBookingDate, "MMM d");
        const maxBookingDateStr = format(rfp.maxBookingDate, "MMM d yyyy");
        const match =
          rfp.name.toLowerCase().includes(search) ||
          rfp.cutoffDate.toLowerCase().includes(search) ||
          rfp.agreementType.toLowerCase().includes(search) ||
          cutOffDateStr.toLowerCase().includes(search) ||
          minBookingDateStr.toLowerCase().includes(search) ||
          maxBookingDateStr.toLowerCase().includes(search);
        return match;
      }
    );
    return event;
  });
}

function filterByStatus(
  events: ParsedEvent[],
  filters: string[]
): ParsedEvent[] {
  if (filters.length) {
    events.map((event) => {
      event.RequestForProposalList = event.RequestForProposalList.filter(
        (rfp) => {
          return filters.includes(rfp.status_id.toString());
        }
      );
      return event;
    });
  }
  return events;
}

async function getParsedEvents(): Promise<ParsedEvent[]> {
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
      const { minBookingDate, maxBookingDate } = getMinMaxBookingDates(
        current.drl_rooming_list_bookings
      );
      events[eventName].RequestForProposalList.push({
        agreementType: current.drl_rfp.agreement_type,
        cutoffDate: current.cutoff_date,
        name: current.drl_rfp.event_internal_name,
        totalBookings: current.drl_rooming_list_bookings.length,
        maxBookingDate: fromUnixTime(maxBookingDate).toISOString(),
        minBookingDate: fromUnixTime(minBookingDate).toISOString(),
        id: current.drl_rfp.rfp_launchpad_id,
        agreementPath: current.drl_rfp.agreement_path,
        status_id: current.status_id,
      });
    }
    return events;
  }, {} as Record<string, ParsedEvent>);

  return Object.values(events);
}

function getMinMaxBookingDates(bookings: Array<Booking>) {
  let maxBookingDate = 0;
  let minBookingDate = 0;
  for (let i = 0; i < bookings.length; i++) {
    const bookingDate = getUnixTime(bookings[i].booking_date);
    if (bookingDate > maxBookingDate) {
      maxBookingDate = bookingDate;
    }
    if (bookingDate < minBookingDate || minBookingDate === 0) {
      minBookingDate = bookingDate;
    }
  }
  return {
    maxBookingDate,
    minBookingDate,
  };
}
