

export const navData = {
    admin: {
        bg: "bg-emerald-900",
        roleLabel: "Admin",
        links: [
            { href: "/stickers",  label: "Stickers"   },
            { href: "/labels",    label: "Labels"      },
            { href: "/materials", label: "Materials"   },
            { href: "/admin",     label: "Admin Panel" },
        ],
    },
    member: {
        bg: "bg-amber-800",
        roleLabel: "Member",
        links: [
            { href: "/stickers",  label: "Stickers"  },
            { href: "/labels",    label: "Labels"    },
            { href: "/materials", label: "Materials" },
        ],
    },
    user: {
        bg: "bg-black",
        roleLabel: "User",
        links: [
            { href: "/stickers",  label: "Stickers"  },
            { href: "/labels",    label: "Labels"    },
            { href: "/materials", label: "Materials" },
        ],
    },
}