import Button from './Button';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <svg viewBox="0 0 220 150" className="mx-auto mb-4 h-28 w-40 text-primary-500" fill="none" aria-hidden="true">
        <path d="M34 104c20-38 52-57 96-57 22 0 40 5 56 14" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M58 100h95c16 0 29 13 29 29H30c0-16 12-29 28-29Z" fill="currentColor" opacity=".12" />
        <circle cx="76" cy="58" r="16" fill="currentColor" opacity=".2" />
        <path d="m124 64 16-30 16 30h-32Z" fill="currentColor" opacity=".28" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{description}</p>
      {actionLabel && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
