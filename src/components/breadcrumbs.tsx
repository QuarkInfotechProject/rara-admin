"use client";
import { useSelectedLayoutSegments } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Breadcrumbs() {
  const segments = useSelectedLayoutSegments();

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <React.Fragment key={segment}>
            {index !== segments.length - 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize" href={`/admin/${segment}`}>
                    {segment}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage className="capitalize font-semibold">{segment}</BreadcrumbPage>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
