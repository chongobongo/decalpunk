import { Button } from "@/components/ui/button"
import Link from "next/link"


export const FormButtonList = () => {

    return (
        <section className="flex h-full min-h-0 flex-row bg-slate-200">
            <ul className=" flex h-full shrink-0 flex-col gap-4 overflow-y-auto border-r-2 border-slate-900 p-5 [&>*]:shrink-0">
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new-order/custom-sticker"><h3 className="text-white text-xl font-bold">Custom Sticker</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Hang Tag</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Sticker Packs</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Die Cut</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">D.T.F.</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Epoxy Dome</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Floor</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Front Adhesive</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Heavy Duty</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Kiss Cut</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Removable</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Single Sheets</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Sticker Sheets</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Transfer</h3></Link>
                </Button>
                <Button asChild className="bg-slate-900">
                  <Link href="/admin/job-orders/new/media"><h3 className="text-white text-xl font-bold">Wall</h3></Link>
                </Button>
            </ul>
            <div id="form-container" className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto text-center">
            <div className="mt-20">
                <h3 className="text-xl font-bold">Form Container</h3>
                <p>This is the index page for new forms.</p>
            </div>
            </div>
        </section>
    )
}