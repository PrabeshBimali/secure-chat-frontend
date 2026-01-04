interface PrimaryButtonProps {
  name: string
  isLoading: boolean
  handleClick: () => void
  disable?: boolean
}

export default function PrimaryButton(props: PrimaryButtonProps) {

  const { name, isLoading, handleClick, disable } = props

  return (
    
    <button
      className="bg-blue-600 hover:bg-blue-500 text-gray-100 p-2 text-xl font-semibold cursor-pointer rounded-sm 
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center gap-1"
      onClick={handleClick}
      disabled={isLoading || disable}
    >
      {isLoading ? (
        <span className="flex items-center gap-1 h-[1.5rem]">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></span>
        </span>
      ) : (
        name
      )}
    </button>
  )
}