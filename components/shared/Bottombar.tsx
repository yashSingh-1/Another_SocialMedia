"use client"

import { sidebarLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation";
import Image from "next/image"

const Bottombar = () => {
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
      {sidebarLinks.map((link) => {
            const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
            return (
              <Link href={link.route} key={link.label} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
              <Image 
                src={link.imgURL}
                alt={link.label}
                width={30}
                height={30}
              />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
              {link.label.split(/\s+/)[0]}
              </p>
            </Link>
            )
          })}
      </div>
    </section>
  )
}

export default Bottombar