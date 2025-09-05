export default function Chat() {
  return (
      <div className="flex-1 h-full flex flex-col bg-bg-primary text-text-primary">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-bg-secondary p-3 rounded-lg max-w-xs">
            Hello! How can I help you today?
          </div>
          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs ml-auto">
            I'd like to know about React layouts
          </div>
          <div className="bg-bg-secondary p-3 rounded-lg max-w-xs">
            I'd be happy to help you with React layouts! What specific aspect would you like to learn about?
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>

  )
}