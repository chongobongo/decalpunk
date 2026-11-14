// Job Orders List Table

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Link from "next/link";


export function JobOrdersListTable({
    jobOrdersList,
}: {
    jobOrdersList: {
        id: string
        job_title: string
    }[]
}) {



    return (
        <Table>
            <TableBody>
                {jobOrdersList.map(item => (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Link href={`/admin/job-orders/job-edit/${item.id}`}>
                                <h3>Job Title: {item.job_title}</h3>
                                <h3>Job ID: {item.id}</h3>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}