import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBoard() {
  return (
    <div className="h-full">
      <Skeleton className="w-96 h-9 rounded-md mb-3 bg-primary-black/20" />
      <div className="grid grid-cols-4 gap-2 h-[670px] w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[670px] w-[282px] p-2 rounded-lg bg-primary-black/20" />
        ))}
      </div>
    </div>
  );
}
