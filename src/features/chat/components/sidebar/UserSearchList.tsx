import { IoSend } from "react-icons/io5";
import { useSidebarSearch } from "../../context/SidebarSearchContext";
import { UserRelationshipStatus, type SearchUserResponse, type UserRelationshipStatusType } from "../../services/chatServices";
import { useActiveChat } from "../../context/ActiveChatProvider";

export default function UserSearchList() {

  const { isSearching, searchResults } = useSidebarSearch()
  const { setSelectedUser } = useActiveChat()

  function statusMessageMapping(status: UserRelationshipStatusType) {
    switch(status) {
      case UserRelationshipStatus.NONE:
        return "Send your first message"
      
      case UserRelationshipStatus.REQUEST_RECEIVED:
        return "Wants to chat"

      case UserRelationshipStatus.FRIENDS:
        return "Click to chat"

      case UserRelationshipStatus.REQUEST_SENT:
        return "Pending request..."

      case UserRelationshipStatus.THEY_BLOCKED:
        return "Cannot message the user"

      case UserRelationshipStatus.YOU_BLOCKED:
        return "You blocked this user"
    }
  }
  
  function userClicked(user: SearchUserResponse) {
    setSelectedUser(user)
  }

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-bg-tertiary">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-bg-secondary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Searching global users...</p>
      </div>
    );
  }

  if (searchResults.length === 0 && !isSearching) {
    return (
      <div className="p-10 text-center">
        <p className="text-text-primary/40 text-sm">No users found with that name.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <p className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-bg-tertiary border-b border-bg-tertiary/10">
        Global Search Results
      </p>

      {searchResults.map((user) => (
        <div 
          key={user.id} 
          onClick={() => userClicked(user)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary/50 cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-bg-tertiary/20 flex items-center justify-center font-bold text-text-secondary flex-shrink-0 border border-bg-tertiary/10">
            {user.username[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div className="truncate">
                <span className="font-semibold text-text-secondary block truncate">
                  {user.username}
                </span>
                <span className="text-xs text-text-primary/50 block truncate">
                  {
                    statusMessageMapping(user.friendshipStatus)
                  }
                </span>
              </div>
              
              <button className="opacity-0 group-hover:opacity-100 p-2.5 bg-blue-500 text-white rounded-full shadow-lg transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                <IoSend size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}