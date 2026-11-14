

import { PageHeader } from "@/components/PageHeader";
import { FormButtonList } from "@/features/admin/job-orders/job-forms/components/JobFormButtons";

export default async function Orders() {

    return (
<main className="flex h-full min-h-0 flex-col">
  <PageHeader />
  <div className="min-h-0 flex-1">
    <FormButtonList />
  </div>
</main>
    )
}