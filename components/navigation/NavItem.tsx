import { NavLinkIcon, NavLinkText, StyledNavLink } from "./navbar.atoms"
import { NavigationPath } from "./paths"

export const NavItem = ({
	label,
	iconClasses,
	path,
	isNavItemActive,
}: NavigationPath & { isNavItemActive: boolean }) => {
	return (
		<StyledNavLink href={path} isNavItemActive={isNavItemActive}>
			<NavLinkIcon className={iconClasses} />
			<NavLinkText>{label}</NavLinkText>
		</StyledNavLink>
	)
}
