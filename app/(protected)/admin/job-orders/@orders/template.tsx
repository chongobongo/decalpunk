// Job-Order - Orders - Template
// src\app\(protected)\admin\job-orders\@orders\template.tsx

"use client"

import Link from "next/link"
import { motion } from 'framer-motion'
import { usePathname } from "next/navigation"

  const qualityLinks = [
    { href:'/', label: 'Open' },
    { href:'/', label: 'Production' },
    { href:'/', label: 'Closed' },
  ];

export default function Template({ children }: { children: React.ReactNode }) {
  const path = usePathname();

    return (
        <div className="h-full bg-amber-100">
          <h3 className="mt-4 text-center text-2xl font-bold">Job Orders</h3>
            <ul id='materialsLinks'
                className='flex flex-row'>
                  {qualityLinks.map((link) => (
                    <li key={link.label}>
                      <Link className='relative mr-4' href={link.href}>
                        {link.href === path && (<motion.span
                          className='absolute left-0 top-full block h-[1px] w-full bg-black'
                          layoutId='underline'
                        />
                      )}
                    <div className='h-full mt-1.5 w-[80px] text-center'>
                    <h3>{link.label}</h3>
                    </div>
                    </Link>
                  </li>
                ))}
            </ul>
          <div id='container' className='flex flex-row'>
                {children}
          </div>
        </div>
    )
}