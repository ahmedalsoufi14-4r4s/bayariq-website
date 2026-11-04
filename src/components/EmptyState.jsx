// A friendly box for "nothing here" messages, with an optional button or link under the text.
// The dashed border works on any background, in light and dark mode.
function EmptyState({ Icon, text, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
      <Icon className="size-10 text-emerald-700 dark:text-emerald-400" />
      <p>{text}</p>
      {children}
    </div>
  )
}

export default EmptyState
