import React, { JSXElementConstructor } from "react";

export interface Menu {
  id: number;
  title: string;
  sortOrder: number;
  icon: string | null;
  url: string | null;
  status: number;
  parentId: number;
  children?: MenuChild[];
}

export interface MenuChild {
  id: number;
  title: string;
  sortOrder: number;
  icon: string | null;
  url: string | null;
  status: number;
  parentId: number;
}
