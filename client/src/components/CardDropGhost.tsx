export default function CardDropGhost({
  overNewColumn,
}: {
  overNewColumn: boolean;
}) {
  const baseStyles =
    "w-full h-[128px] rounded-md border border-dashed opacity-50 my-2";
  const activeStyles = overNewColumn
    ? "border-green-400 bg-green-100"
    : "border-neutral-400 bg-neutral-200";

  return <div className={`${baseStyles} ${activeStyles}`} />;
}
