import React, { useState } from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  options: string[] | undefined;
  setOptions: (options: string[]) => void;
}

function MultiOptionInput({ options, setOptions, ...rest }: Props) {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  // Safely handle options - ensure it's always an array for operations
  const safeOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) {
      console.warn("⚠️ MultiOptionInput received invalid options:", options);
      return [];
    }
    return options;
  }, [options]);

  function addOption() {
    if (
      value &&
      !safeOptions.some((item) => item.toLowerCase() === value.toLowerCase())
    ) {
      setOptions([...safeOptions, value]);
      setValue("");
      setError("");
    } else {
      setError(value ? "Value already exists" : "Please enter a value");
    }
  }

  function removeOption(e: React.MouseEvent<SVGElement>) {
    const targetId = e.currentTarget.id;
    if (safeOptions.length > 0) {
      const updatedOptions = safeOptions.filter(
        (option) => option !== targetId
      );
      setOptions(updatedOptions);
    }
  }

  // Debug logging
  React.useEffect(() => {
    if (options !== undefined && !Array.isArray(options)) {
      console.error(
        "❌ MultiOptionInput - options should be an array or undefined, got:",
        typeof options,
        options
      );
    }
  }, [options]);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-3">
        {safeOptions.map((option) => (
          <Badge className="rounded-sm px-2" key={option}>
            {option}
            <IconX
              id={option}
              size={16}
              className="text-white ml-2 cursor-pointer"
              onClick={removeOption}
            />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...rest}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addOption();
            }
          }}
        />
        <Button type="button" onClick={addOption}>
          <IconPlus />
        </Button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default MultiOptionInput;
