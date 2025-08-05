import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaFilter } from "@/lib/context/media-filter-context";
import { IconSearch } from "@tabler/icons-react";
import FileCategorySelector from "./file-category-selector";
import FileSortOptions from "./file-sort-options";

function MediaFilters() {
  const { category, setCategory, search, sortBy, setSearch, setSortBy } = useMediaFilter();

  const inputRef = useRef<HTMLInputElement>(null);
  function handleSearch() {
    if (inputRef.current) {
      const value = inputRef.current.value;
      setSearch(value);
    }
  }

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex gap-2 w-full sm:w-fit">
        <Input ref={inputRef} className="" name="search" placeholder="Search" defaultValue={search} />
        <Button type="button" size="sm" onClick={handleSearch}>
          <IconSearch />
        </Button>
      </div>
      <FileCategorySelector category={category} setCategory={setCategory} />
      <FileSortOptions sortBy={sortBy} setSortBy={setSortBy} />
    </div>
  );
}

export default MediaFilters;
