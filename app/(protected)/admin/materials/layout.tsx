// Job Orders - Layout
// src\app\(protected)\admin\job-orders\layout.tsx

import { FC, ReactNode } from 'react'
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Materials',
}

interface Properties {
    form: ReactNode,
    list: ReactNode,
}

const page: FC<Properties> = ({ form, list }) => {
    
    return (
        <>
<main className="min-h-screen w-full bg-slate-900 pt-10">
  <section id="container" className="mx-auto flex h-[calc(100vh-8.75rem)] w-11/12 flex-row rounded-lg border-4 border-amber-300">
    <div id="panel" className="w-screen overflow-auto bg-slate-200">
      {form}
    </div>
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {list}
    </div>
  </section>
</main>
        </>
    )
}

export default page
