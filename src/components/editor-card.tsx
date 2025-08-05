import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
  title: string;
  children: React.ReactNode;
}

function EditorCard({ title, children }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export default EditorCard;
