import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Todos" },
  { to: "/marvel", label: "Marvel" },
  { to: "/dc", label: "DC" },
] as const;

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="bg-gradient-to-r from-marvel to-dc bg-clip-text text-transparent">
            SUPERHEROES
          </span>
          <span className="text-muted-foreground text-sm font-normal hidden sm:inline">
            SPA
          </span>
        </Link>
        <nav className="flex gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
