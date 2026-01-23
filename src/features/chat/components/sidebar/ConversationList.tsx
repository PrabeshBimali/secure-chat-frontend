export default function ConversationList() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary/50 cursor-pointer transition-colors">
          <div className="w-12 h-12 rounded-full bg-bg-tertiary/40 flex-shrink-0" />
          <div className="flex-1 min-w-0 border-b border-bg-tertiary/10 pb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold truncate text-text-secondary">Alice Smith</span>
              <span className="text-[11px] text-text-primary">Tue</span>
            </div>
            <p className="text-sm text-text-primary/60 truncate mt-0.5">
              {i === 1 ? "Shared secret established" : "The key exchange was successful."}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}