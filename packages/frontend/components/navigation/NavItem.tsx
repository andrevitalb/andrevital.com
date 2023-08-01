import { Key } from "react"
import { NavLinkIcon, NavLinkText, StyledNavLink } from "./navigation.atoms"
import { NavigationPath } from "./paths"

export const NavItem = ({
	label,
	iconClasses,
	path,
	isNavItemActive,
}: NavigationPath & { isNavItemActive: boolean; key: Key }) => {
	return (
		<StyledNavLink className="group" href={path} tabIndex={1}>
			<NavLinkIcon className={iconClasses} $isNavItemActive={isNavItemActive} />
			<NavLinkText $isNavItemActive={isNavItemActive}>{label}</NavLinkText>
		</StyledNavLink>
	)
}
