import Link from "next/link"
import { NavLinkIcon, NavLinkText, StyledNavLink } from "./navigation.atoms"
import { NavigationPath } from "./paths"

export const NavItem = ({
	label,
	iconClasses,
	path,
	isNavItemActive,
}: NavigationPath & { isNavItemActive: boolean }) => {
	const MenuItemWrapper = ({ children }: { children: React.ReactNode }) => (
		<Link href={path} passHref>
			{children}
		</Link>
	)

	return (
		<MenuItemWrapper>
			<StyledNavLink className="group" href={path} tabIndex={1}>
				<>
					<NavLinkIcon
						className={iconClasses}
						isNavItemActive={isNavItemActive}
					/>
					<NavLinkText isNavItemActive={isNavItemActive}>
						{label}
					</NavLinkText>
				</>
			</StyledNavLink>
		</MenuItemWrapper>
	)
}
