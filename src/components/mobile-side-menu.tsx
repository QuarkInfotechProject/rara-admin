import { Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "@/types/menu.types";
import ChnLogo from "./chn-logo";
import MenuLink from "./menu-link";

interface Props {
  menu: Menu[];
}

function MobileSideMenu({ menu }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-4 text-lg font-medium">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-semibold">
            <ChnLogo />
          </Link>
          <ScrollArea className="h-[calc(100vh-100px)]">
            {menu.map((item) => (
              <MenuLink key={item.id} type="mobile" item={item} />
            ))}
          </ScrollArea>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSideMenu;
