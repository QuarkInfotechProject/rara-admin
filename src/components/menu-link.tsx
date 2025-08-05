import { cn } from "@/lib/utils";
import { Menu } from "@/types/menu.types";
import { IconChevronDown } from "@tabler/icons-react";
import { headers } from "next/headers";

interface Props {
  type: "mobile" | "desktop";
  item: Menu;
  nested?: boolean;
}

async function MenuLink({ type, item, nested }: Props) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path") ?? "";
  const link = `/admin${item.url}`;
  const Wrapper = item.children ? "div" : "a";
  const isExpanded = item.children?.some((item) => pathname.startsWith(`/admin${item.url}`));

  return (
    <label htmlFor={`${type}-${item.id}`}>
      <Wrapper
        key={item.id}
        href={link ?? "#"}
        aria-selected={pathname === link}
        className={cn(
          "flex items-center px-3 py-2 text-muted-foreground aria-selected:bg-muted transition-all hover:text-primary group cursor-pointer",
          type === "desktop" && "gap-3 rounded-lg",
          type === "mobile" && "gap-4 rounded-xl",
          nested && "ml-2"
        )}
      >
        <i className={cn("text-xl ti", "ti-" + item.icon)} />
        {item.title}
        {item.children && <IconChevronDown className="ml-auto" size={20} />}
      </Wrapper>
      <input className="peer" type="checkbox" id={`${type}-${item.id}`} hidden defaultChecked={!!isExpanded} />
      <div
        className="ml-2 h-0 peer-checked:h-[--menu-height] transition-all overflow-hidden"
        data-test={isExpanded}
        style={{
          // @ts-ignore
          "--menu-height": `${(item.children?.length ?? 0) * (type === "desktop" ? 36 : 44)}px`,
        }}
      >
        {item.children?.map((item) => (
          <MenuLink key={item.id} type={type} item={item} nested />
        ))}
      </div>
    </label>
  );
}

export default MenuLink;
