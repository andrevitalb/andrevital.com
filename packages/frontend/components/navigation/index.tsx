import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { NavItem } from "./NavItem"
import {
	NavLinkContainer,
	NavSocialLink,
	NavSocialLinkContainer,
	StyledHeader,
} from "./navigation.atoms"
import { navigationPaths } from "./paths"

export const Navigation = () => {
	const router = useRouter()
	const routerPath = router.asPath

	const currentPath = useMemo(() => {
		return (
			navigationPaths?.find((item) => {
				if (item.path !== "/") return routerPath.includes(item.path)
				return routerPath === item.path
			}) ?? navigationPaths[0]
		)
	}, [routerPath])

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
			<nav tw="h-full">
				<div tw="h-full py-4 px-2 flex flex-row md:flex-col justify-between">
					<Link
						href="/"
						tw="hidden md:flex justify-center items-center cursor-pointer"
					>
						<img
							src="/images/logo_negative.svg"
							alt="André Vital"
							tw="w-10 transition-all duration-300 hover:scale-110 block"
						/>
					</Link>
					<NavLinkContainer>{navItems}</NavLinkContainer>
					<NavSocialLinkContainer>
						<NavSocialLink
							href="https://www.github.com/andrevitalb"
							rel="noopener noreferrer"
							target="_blank"
							title="GitHub"
						>
							<i className="fab fa-github" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.linkedin.com/in/andrevitalb/"
							rel="noopener noreferrer"
							target="_blank"
							title="LinkedIn"
						>
							<i className="fab fa-linkedin-in" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.instagram.com/im_andrevital"
							rel="noopener noreferrer"
							target="_blank"
							title="Instagram"
						>
							<i className="fab fa-instagram" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.twitter.com/andrevitalb"
							rel="noopener noreferrer"
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
