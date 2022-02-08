import { useRouter } from "next/router"
import { useMemo } from "react"
import { NavLink } from "react-router-dom"
import {
	NavLinkContainer,
	NavSocialLink,
	NavSocialLinkContainer,
	StyledHeader,
} from "./navbar.atoms"
import { NavItem } from "./NavItem"
import { navigationPaths } from "./paths"

const Navbar = () => {
	const router = useRouter()
	const routerPath = router.asPath

	const currentPath = useMemo(
		() => navigationPaths?.find((item) => routerPath.includes(item.path)),
		[navigationPaths, routerPath],
	)

	const navItems = navigationPaths?.map((item) => {
		const { label, iconClasses, path } = item
		const isNavItemActive = item === currentPath
		return (
			<NavItem
				key={path}
				label={label}
				iconClasses={iconClasses}
				path={path}
				isNavItemActive={isNavItemActive}
			/>
		)
	})

	return (
		<StyledHeader>
			<nav className="h-full">
				<div className="h-full py-4 px-2 flex flex-row md:flex-col justify-between">
					<NavLink
						to="/"
						className="hidden md:flex justify-center items-center"
						title="Home"
					>
						<img
							src="/assets/images/logo_negative.svg"
							alt="André Vital"
							className="w-10 transition-all duration-300 hover:scale-110 block"
						/>
					</NavLink>
					<NavLinkContainer>{navItems}</NavLinkContainer>
					<NavSocialLinkContainer>
						<NavSocialLink
							href="https://www.github.com/andrevitalb"
							rel="noreferrer"
							target="_blank"
							title="GitHub"
						>
							<i className="fab fa-github" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.linkedin.com/in/andrevitalb/"
							rel="noreferrer"
							target="_blank"
							title="LinkedIn"
						>
							<i className="fab fa-linkedin-in" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.instagram.com/im_andrevital"
							rel="noreferrer"
							target="_blank"
							title="Instagram"
						>
							<i className="fab fa-instagram" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.twitter.com/andrevitalb"
							rel="noreferrer"
							target="_blank"
							title="Twitter"
						>
							<i className="fab fa-twitter" />
						</NavSocialLink>
					</NavSocialLinkContainer>
				</div>
			</nav>
		</StyledHeader>
	)
}

export default Navbar
