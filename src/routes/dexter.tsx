import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dexter")({
  component: DexterRedirect,
});

function DexterRedirect() {
  return <Navigate to="/ai" />;
}
