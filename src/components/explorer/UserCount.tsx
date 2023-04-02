import { RiUser3Line } from "react-icons/ri";

export function UserCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex flex-row self-center text-xs">
      <RiUser3Line className={"h-3 w-3 self-center"} />
      {count}
    </div>
  );
}
