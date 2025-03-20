import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./toggle-theme";

export const HeaderMenu = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center w-full gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <ModeToggle />
      </div>
    </header>
  );
};
