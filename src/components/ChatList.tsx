export default function ChatList() {
  return (
    <div className="w-80 bg-bg-primary text-text-primary border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Prabesh</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto text-text-secondary">
        <div className="space-y-2">
          <div className="p-3 rounded-lg hover:bg-bg-secondary cursor-pointer">
            <div className="font-medium">Chat 1</div>
            <div className="text-sm text-text-primary">Last message...</div>
          </div>
          <div className="p-3 rounded-lg hover:bg-bg-secondary cursor-pointer">
            <div className="font-medium">Chat 2</div>
            <div className="text-sm text-text-primary">Last message...</div>
          </div>
          <div className="p-3 rounded-lg hover:bg-bg-secondary cursor-pointer">
            <div className="font-medium">Chat 3</div>
            <div className="text-sm text-text-primary">Last message...</div>
          </div>
        </div>
      </div>
    </div>
  )
}