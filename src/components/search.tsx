"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function Search() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");
  const router = useRouter();

  function search() {
    if (!value) return;
    const pageURL = new URL(window.location.href);
    pageURL.searchParams.set("search", value);
    router.push(pageURL.href);
  }
  return null;

  return (
    <div className="flex gap-2 w-full min-[400px]:w-auto">
      <Input className="" type="text" placeholder="Search" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button size="sm" type="button" onClick={search}>
        <IconSearch size={20} />
      </Button>
    </div>
  );
}

export default Search;
