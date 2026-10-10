import { useRouterState } from "@tanstack/react-router";

/** The Studio is a tool, not a page — it renders with no website chrome. */
export function useIsStudio() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname === "/studio" || pathname.startsWith("/studio/");
}
