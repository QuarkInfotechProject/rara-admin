import ThemeToggle from "@/components/theme-toggle";
import { Menu } from "@/types/menu.types";
import Breadcrumbs from "./breadcrumbs";
import MobileSideMenu from "./mobile-side-menu";
import HeaderMenu from "./header-menu";

interface Props {
  menu: Menu[];
}

function Header({ menu }: Props) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
      <MobileSideMenu menu={menu} />
      <div className="w-full flex-1">
        <Breadcrumbs />
      </div>
      <ThemeToggle />
      <HeaderMenu />
    </header>
  );
}

export default Header;
