import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "bg-elevated text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] border-0",
          title: "text-fg",
          description: "text-muted",
        },
      }}
    />
  );
}

export { Toaster };
