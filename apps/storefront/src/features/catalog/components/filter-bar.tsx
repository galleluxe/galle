"use client";

import { useQueryState } from "nuqs";
import { Chip } from "@/components/ui/chip";

const FILTERS = ["ALL", "FLORAL", "WOODY", "FRESH", "ORIENTAL"] as const;

export function FilterBar() {
  const [family, setFamily] = useQueryState("family", {
    defaultValue: "ALL",
    shallow: true,
  });

  const active = family?.toUpperCase() ?? "ALL";

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-4 py-4 justify-start md:justify-center">
      {FILTERS.map((f) => (
        <Chip
          key={f}
          active={active === f}
          onClick={() => setFamily(f === "ALL" ? null : f.toLowerCase())}
        >
          {f} COLLECTION
        </Chip>
      ))}
    </div>
  );
}
