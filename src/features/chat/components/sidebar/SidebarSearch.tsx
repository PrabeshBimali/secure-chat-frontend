import { useEffect } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { IoSearchOutline } from "react-icons/io5"
import { searchUser } from "../../services/chatServices";
import { useAuth } from "../../../../context/AuthProvider";
import { validateUsername } from "../../../../lib/utils/formValidation";
import { useSidebarSearch } from "../../context/SidebarSearchContext";

export default function SidebarSearch() {
  
  const { setSearchResults, setIsSearching, searchTerm, setSearchTerm } = useSidebarSearch()
  const debouncedUserSearch = useDebounce(searchTerm, 1000)
  const authContext = useAuth()
  const { user, refreshUser } = authContext

  useEffect(() => {
    setIsSearching(true)
    if(validateUsername(debouncedUserSearch) !== "") {
      setSearchResults([])
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    const fetchUser = async (searchTerm: string) => {
      try{

        if(user === undefined) {
          refreshUser()
          return
        }
        const rawUsers =  await searchUser(user.userid, searchTerm, signal)

        if(!rawUsers.success) {
          throw new Error(rawUsers.message)
        }

        const users = rawUsers.data
      
        if(users === undefined) {
          // add some error with toast here
          return
        }
        setSearchResults(users)
      } catch(error) {

        if(error instanceof DOMException && error.name === "AbortError") {
          return
        }
        console.log("Some Error: ", error)
        // TODO show unknown error in toast
      } finally {
        setIsSearching(false)
      }
    }
    
    fetchUser(debouncedUserSearch)

    return () => controller.abort()
    
  }, [debouncedUserSearch])

  return (
    <div className="px-4 pb-4">
      <div className="relative group">
        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-bg-tertiary group-focus-within:text-text-primary transition-colors" size={18} />
        <input 
          value={searchTerm}
          type="text" 
          placeholder="Search" 
          className="w-full bg-bg-secondary/60 border border-transparent focus:border-bg-tertiary/30 py-2 pl-10 pr-4 rounded-full focus:outline-none transition-all placeholder:text-bg-tertiary"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}