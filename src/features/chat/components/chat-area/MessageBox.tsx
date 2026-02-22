import { IoShieldCheckmark } from "react-icons/io5";
import type { MessageDetailForUI } from "../../../../store/ActiveChatStore";
import { activeChatPartnerStore } from "../../../../store/ActivePartnerStore";

export default function MessageBox(props: {messageDetail: MessageDetailForUI}) {
  const { messageDetail } = props
  const chatPartner = activeChatPartnerStore.getSnapshot()

  if(messageDetail.senderId === chatPartner?.id) {
    return (
      <div className="flex flex-col items-start max-w-[75%]">
        <div className="bg-bg-primary border border-bg-tertiary/20 text-text-primary px-4 py-2 rounded-2xl rounded-tl-none shadow-sm text-[15px]">
          {messageDetail.message}
        </div>
        <span className="text-[10px] text-bg-tertiary mt-1 ml-1 font-medium">10:12 AM</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end self-end max-w-[75%]">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm text-[15px]">
        {messageDetail.message}
      </div>
      <div className="flex items-center gap-1 mt-1 mr-1">
         <span className="text-[10px] text-bg-tertiary font-medium">10:32 AM</span>
         {/*TODO: Should change according to message status*/}
         <IoShieldCheckmark size={12} className="text-green-500" />
      </div>
    </div>
  )
}