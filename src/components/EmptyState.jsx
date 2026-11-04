// A friendly box for "nothing here" messages, with an optional button or link under the text.
// It has its own white background, so it reads well on the page, in a dialog and on a navy band.
function EmptyState({ Icon, text, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface p-6 text-center text-muted">
      <span className="flex size-14 items-center justify-center rounded-full bg-main-soft text-main-ink">
        <Icon className="size-8" />
      </span>
      <p>{text}</p>
      {children}
    </div>
  )
}

export default EmptyState
