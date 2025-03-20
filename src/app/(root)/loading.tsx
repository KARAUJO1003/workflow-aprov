import { Loader2Icon } from "lucide-react";

export default function loading() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <Loader2Icon className="size-6 text-blue-500 animate-spin" />
    </div>
  );
}
