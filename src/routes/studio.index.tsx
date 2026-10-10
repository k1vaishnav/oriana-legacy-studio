import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/studio/")({
  ssr: false,
  component: () => null,
});
