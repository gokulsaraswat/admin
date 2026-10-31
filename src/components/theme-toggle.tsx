"use client";

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Switch theme"
      title="Switch theme"
      onClick={() => {
        const dark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", dark ? "dark" : "light");
      }}
      className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-foreground"
    >
      ◐
    </button>
  );
}
