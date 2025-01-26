"use client";
import { useCallback } from "react";
import { debounce } from "lodash";
import SearchIcon from "@icons/search.svg";
import FiltersIcon from "@icons/filters.svg";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const SearchHeader = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300),
    [searchParams]
  );

  return (
    <div className={`flex gap-10 mt-8`}>
      <div className="flex relative min-w-72">
        <div className="absolute border-1 border-slate-300 bg-slate-100 rounded-md top-1 left-1 p-1">
          <SearchIcon className="h-5 w-5 m-1" color="#777E90" />
        </div>
        <input
          className="w-full rounded-lg border-2 border-slate-300 flex pl-12 font-medium text-sm"
          placeholder="Search"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <Popover className="relative">
        <PopoverButton className="flex gap-3 h-10 bg-white rounded-lg border-2  border-slate-300 p-5 justify-center items-center">
          <span className="font-medium text-sm">Filters</span>
          <FiltersIcon className="h-4 w-4" color="#00C2A6" />
        </PopoverButton>
        <PopoverPanel
          anchor="bottom"
          className="flex flex-col p-3 gap-2 rounded-md mt-2 w-56 bg-white ring-1 shadow-lg ring-black/5 transition"
        >
          <span className="text-xs text-[#777E90]">RFP STATUS</span>
          <label className="flex items-center font-semibold">
            <input type="checkbox" className="mr-2" />
            Active
          </label>
          <label className="flex items-center font-semibold">
            <input type="checkbox" className="mr-2" />
            Closed
          </label>
          <label className="flex items-center font-semibold">
            <input type="checkbox" className="mr-2" />
            Canceled
          </label>
          <button className="bg-[#4323FF] text-white font-semibold rounded-md py-2">
            Save
          </button>
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export default SearchHeader;
