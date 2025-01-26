export interface Booking {
  id: number;
  room_code: string;
  primary_guest: string;
  roommates: string;
  guests: number;
  room_name: string;
  check_in: string; // ISO date
  check_out: string; // ISO date
  booking_date: string; // ISO date
}

export interface RequestForProposal {
  rfp_launchpad_id: string;
  event_name: string;
  event_internal_name: string;
  event_start_date: string; // ISO date
  event_end_date: string; // ISO date
  agreement_type: string; // @TODO: make this an union
  agreement_path: string;
}

export interface Rooming {
  id: number;
  status_id: number;
  rfp_id: number;
  hotel_id: number;
  platform_id: number;
  cutoff_date: string; // ISO date
  created_at: string; // ISO date
  modified_at: string; // ISO date,
  drl_rooming_list_bookings: Array<Booking>;
  drl_rfp: RequestForProposal;
}

// Parsed event

export interface ParsedRequestForProposal {
  name: RequestForProposal["event_name"];
  agreementType: RequestForProposal["agreement_type"];
  agreementPath: RequestForProposal["agreement_path"];
  cutoffDate: Rooming["cutoff_date"];
  minBookingDate: string;
  maxBookingDate: string;
  totalBookings: number;
  id: RequestForProposal["rfp_launchpad_id"];
  status_id: Rooming["status_id"];
}

export interface ParsedEvent {
  name: RequestForProposal["event_name"];
  RequestForProposalList: Array<ParsedRequestForProposal>;
}
