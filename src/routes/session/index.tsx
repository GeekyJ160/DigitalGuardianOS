import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useGuardianStore } from "@/lib/guardian/store";

export const Route = createFileRoute("/session/")({
  component: SessionIndex,
});

function SessionIndex() {
  const id = useGuardianStore((s) => s.activeSessionId);
  if (id) return <Navigate to="/session/$id" params={{ id }} />;
  return <Navigate to="/session/new" />;
}
