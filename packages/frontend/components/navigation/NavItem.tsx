import { NavLinkIcon, NavLinkText, StyledNavLink } from "./navigation.atoms"
import { NavigationPath } from "./paths"

export const NavItem = ({
	label,
	iconClasses,
	path,
	isNavItemActive,
}: NavigationPath & { isNavItemActive: boolean }) => {
	return (
		<StyledNavLink className="group" href={path} tabIndex={1}>
			<NavLinkIcon className={iconClasses} $isNavItemActive={isNavItemActive} />
			<NavLinkText $isNavItemActive={isNavItemActive}>{label}</NavLinkText>
		</StyledNavLink>
	)
}
