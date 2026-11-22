// Sticker Orders - Layout
// app\(public)\stickers\pages\layout.tsx

import { FC, ReactNode } from 'react'
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Sticker Order',
}

interface Properties {
    form: ReactNode,
    list: ReactNode,
}

const page: FC<Properties> = ({ form, list }) => {
    
    return (
        <>
<main className="min-h-screen w-full bg-slate-900 py-4 sm:pt-10">
  <section
    id="container"
    className="mx-auto flex w-11/12 flex-col overflow-hidden rounded-lg border-4 border-amber-300 lg:h-[calc(100dvh-8.75rem)] lg:flex-row"
  >
    <div
      id="panel"
      className="flex min-h-0 min-w-0 flex-col bg-slate-200 lg:h-full lg:flex-[3] lg:overflow-hidden"
    >
      {form}
    </div>

    {/* Button list: desktop only */}
    <div className="hidden min-h-0 min-w-0 flex-col lg:flex lg:h-full lg:flex-1">
      {list}
    </div>
  </section>
</main>
        </>
    )
}

export default page
