import { Link, useNavigate } from "react-router-dom";
import { tabletAnimationLink } from "../tablet/tablet_utils/tablet_animation_link_spa";

export default function Navbar() {
    const navigate = useNavigate();
    const NavLinks = [
        {
            title: "Projects",
            href: "/project",
        },
        {
            title: "About",
            href: "/about",
        },
        {
            title: "Stack",
            href: "/stack",
        },
        {
            title: "Contact",
            href: "/contact",
        },
    ];

    const starNavigationLink = (
        e: React.MouseEvent,
        href: string
    ) => {
        e.preventDefault();
        tabletAnimationLink.handleNavigation(() => {
            navigate(href);
        });
    };

    return (
        <nav
            data-tablet-fade
            className="fixed top-0 left-0 z-10 w-full flex justify-center backdrop-blur-md bg-black/20"
        >
            <div className="w-full max-w-[1700px] h-[88px] px-8 flex items-center justify-between">
                <Link to="/" className="h-8 w-20 flex items-center justify-center">
                    <img src="/images/logo/logo.png" alt="" className="w-full h-full" />
                </Link>
                <ul className="flex items-center gap-15 text-[11px] uppercase tracking-widest">
                    {NavLinks.map((link) => (
                        <li
                            key={link.title}
                            className="hover:text-red-500 transition-colors duration-300"
                        >
                            <Link
                                to={link.href}
                                onClick={(e) =>
                                    starNavigationLink(e, link.href)
                                }
                                className="text-white hover:text-red-500 transition-colors duration-300"
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}