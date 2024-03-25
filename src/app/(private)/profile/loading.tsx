import { Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="space-y-6 max-w-md w-80">
      <Loader2 className="animate-spin" />
    </div>
  );
}
