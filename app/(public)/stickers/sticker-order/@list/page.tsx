import { StickerOrderButtonList } from "@/features/stickers/components/StickerOrderButtonList"
import { ST } from "next/dist/shared/lib/utils"

const page = () => {
  return (
    <div className="w-full h-full bg-slate-300">
      <StickerOrderButtonList />
    </div>
  )
}

export default page
