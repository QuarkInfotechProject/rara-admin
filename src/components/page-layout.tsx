import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Pagination from "./pagination";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  hasMore?: boolean;
  hidePagination?: boolean;
}

function PageLayout({ title, description, children, actions, hasMore, hidePagination }: Props) {
  return (
    <div>
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </div>
      <Card className="max-w-[calc(100vw-32px)]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="max-w-7xl w-[100vh-48px]">{children}</CardContent>
        {!hidePagination && (
          <CardFooter>
            <Pagination hasMore={hasMore} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default PageLayout;
