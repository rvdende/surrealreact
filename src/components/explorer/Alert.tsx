export function Alert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded bg-rose-600/30 p-2 text-rose-500">{message}</div>
  );
}
