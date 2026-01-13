import Link from "next/link";
import ChnLogo from "@/components/chn-logo";
import Header from "@/components/header";
import SideMenu from "@/components/side-menu";
import getAdminMenu from "@/lib/utils/server/get-admin-menu";
import { Menu } from "@/types/menu.types";

// Force dynamic rendering since this layout uses cookies for authentication
export const dynamic = "force-dynamic";

async function AdminLayout({ children }: { children: React.ReactNode }) {
  let menu: Menu[] = [];
  let menuError: string | null = null;

  try {
    menu = await getAdminMenu();
  } catch (error: any) {
    // Log the full error details
    console.error("=".repeat(60));
    console.error("🚨 ADMIN LAYOUT - Menu Fetch Error:");
    console.error("Error Message:", error.message);
    console.error("Error Response Status:", error.response?.status);
    console.error("Error Response Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("=".repeat(60));

    menuError = error.response?.data?.error || error.message || "Unknown error";
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <ChnLogo />
            </Link>
          </div>
          {menuError ? (
            <div className="p-4 text-red-500 text-sm">
              <p className="font-bold">Menu Error:</p>
              <p>{menuError}</p>
            </div>
          ) : (
            <SideMenu menu={menu} />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <Header menu={menu} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css" />
    </div>
  );
}

export default AdminLayout;
