export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="card-surface p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-500 mt-2">{description}</p>
    </div>
  );
}
