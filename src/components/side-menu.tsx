import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "@/types/menu.types";
import MenuLink from "./menu-link";

interface Props {
  menu: Menu[];
}

function SideMenu({ menu }: Props) {
  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4 overflow-auto">
        {menu.map((item: Menu) => (
          <MenuLink key={item.id} type="desktop" item={item} />
        ))}
      </nav>
    </ScrollArea>
  );
}

export default SideMenu;
