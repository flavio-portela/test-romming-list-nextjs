/**
 * @TODO:
 * - mode hard-coded colors to theme
 */

import type { RFP } from "@/app/data-access/bookings";
import DownloadIcon from "@icons/download.svg";
import CalendarIcon from "@icons/calendar.svg";

interface RFPCard {
  rfp: RFP;
}

const RFPCard = ({ rfp }: RFPCard) => {
  return (
    <div className="border-slate-300 rounded-md min-w-[400px] bg-white p-4">
      <div className="flex border-1  justify-between">
        <div className={" flex flex-col"}>
          <div className="text-base font-bold">{rfp.name}</div>
          <div>
            <span className="text-sm font-medium">Agreement:</span>{" "}
            <span className="text-sm font-bold capitalize">
              {rfp.agreementType}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-[#3E8CFF1A] w-[56px] rounded-lg">
            <div className="bg-[#3E8CFF40] rounded-t-lg text-[#3E8CFF] uppercase text-xs font-semibold text-center">
              Jan
            </div>
            <div className="text-[#3E8CFF] text-[26px] font-bold text-center">
              8
            </div>
          </div>
          <span className="text-sm text-[#777E90] font-medium mt-1">
            Cut-Off Date
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <CalendarIcon />
        <span className="ml-1 text-sm text-[#777E90]">
          Jan 31 - Feb 2, 2025
        </span>
      </div>
      <div className="flex mt-4 gap-2">
        <button className="bg-[#4323FF] text-white rounded-lg p-1 flex-grow">
          View Bookings ({rfp.totalBookings})
        </button>
        <button className="p-2 border-2 rounded-lg border-[#4323FF]">
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
};

export default RFPCard;
