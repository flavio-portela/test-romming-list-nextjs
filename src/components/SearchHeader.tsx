import SearchIcon from "@icons/search.svg";
import FiltersIcon from "@icons/filters.svg";

interface SearchHeaderProps {
  className?: string;
  onSearch: (search: string) => void;
}

const SearchHeader = ({ className = "", onSearch }: SearchHeaderProps) => {
  return (
    <div className={`flex gap-10 mt-8 ${className}`}>
      <div className="flex relative min-w-72">
        <div className="absolute border-1 border-slate-300 bg-slate-100 rounded-md top-1 left-1 p-1">
          <SearchIcon className="h-5 w-5 m-1" color="#777E90" />
        </div>
        <input
          className="w-full rounded-lg border-2 border-slate-300 flex pl-12 font-medium text-sm"
          placeholder="Search"
          onChange={(e) => {
            onSearch(e.target.value);
          }}
        />
      </div>
      <button className="flex gap-3 h-10 bg-white rounded-lg border-2  border-slate-300 p-5 justify-center items-center">
        <span className="font-medium text-sm">Filters</span>
        <FiltersIcon className="h-4 w-4" color="#00C2A6" />
      </button>
    </div>
  );
};

export default SearchHeader;
