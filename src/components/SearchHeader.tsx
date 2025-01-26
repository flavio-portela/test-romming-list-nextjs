"use client";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import SearchIcon from "@icons/search.svg";
import FiltersIcon from "@icons/filters.svg";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const statusOptions: Array<{
  value: string;
  name: string;
  checked: boolean;
}> = [
  {
    value: "1",
    name: "Active",
    checked: false,
  },
  {
    value: "2",
    name: "Closed",
    checked: false,
  },
  {
    value: "3",
    name: "Canceled",
    checked: false,
  },
];

const SearchHeader = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [statusOptionCheckedState, setStatusOptionsCheckedState] = useState(
    new Array(statusOptions.length).fill(false)
  );

  useEffect(() => {
    const filters = searchParams.get("filters");
    if (filters) {
      const currentFilters = filters.split(",");
      setStatusOptionsCheckedState((state) => {
        return state.map((_, i) => {
          return currentFilters.includes(statusOptions[i].value);
        });
      });
    }
  }, [searchParams]);

  const handleStatusFilterChange = (position: number) => {
    setStatusOptionsCheckedState((state) => {
      return state.map((s, i) => (i === position ? !s : s));
    });
  };

  const handleSearchQuery = useCallback(
    debounce((term: string) => {
      console.log({ term });
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

  const handleSearchStatus = () => {
    const params = new URLSearchParams(searchParams);
    // Get the selected filters
    const selectedFilters = statusOptionCheckedState.reduce(
      (selected, status, index) => {
        if (status) {
          selected.push(statusOptions[index].value);
          return selected;
        }
        return selected;
      },
      [] as string[]
    );
    if (selectedFilters.length) {
      params.set("filters", selectedFilters);
    } else {
      params.delete("filters");
    }
    replace(`${pathname}?${params.toString()}`);
  };

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
            handleSearchQuery(e.target.value);
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
          {statusOptions.map((option, index) => {
            return (
              <label
                className="flex items-center font-semibold"
                key={`status-option-${index}`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={statusOptionCheckedState[index]}
                  className="mr-2"
                  onChange={() => handleStatusFilterChange(index)}
                />
                {option.name}
              </label>
            );
          })}
          <PopoverButton
            onClick={handleSearchStatus}
            className="bg-[#4323FF] text-white font-semibold rounded-md py-2"
          >
            Save
          </PopoverButton>
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export default SearchHeader;
