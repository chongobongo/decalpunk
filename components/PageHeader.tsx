import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function PageHeader({ title = "New Order" }: { title?: string }) {
  return (
<div className="flex flex-row items-center justify-between">
  <h1 className="ml-4 text-2xl font-semibold">{title}</h1>
  <ul className="mr-20 flex flex-row gap-4 p-2">
    <li className="flex flex-col text-center">
      <h3 className="font-bold">New Count</h3>
      <h1>10</h1>
    </li>
    <li className="flex flex-col text-center">
      <h3 className="font-bold">Production Count</h3>
      <h1>10</h1>
    </li>
    <li className="flex flex-col text-center">
      <h3 className="font-bold">Closed Count</h3>
      <h1>10</h1>
    </li>
  </ul>
</div>
  )
}
