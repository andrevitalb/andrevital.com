import { NavLink } from "react-router-dom"
import {
	NavLinkContainer,
	NavLinkIcon,
	NavLinkText,
	NavSocialLink,
	NavSocialLinkContainer,
	StyledHeader,
	StyledNavLink,
} from "./navbar.atoms"

const Navbar = () => {
	const isNavLinkActiveHelper = ({
		isActive,
	}: {
		isActive: boolean
	}): string => (isActive ? "active" : "")

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
					<NavLinkContainer>
						<StyledNavLink
							end
							to="/"
							className={isNavLinkActiveHelper}
							title="Home"
						>
							<NavLinkIcon className="fal fa-home-alt" />
							<NavLinkText>Home</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							to="/develop"
							className={isNavLinkActiveHelper}
							title="Develop Portfolio"
						>
							<NavLinkIcon className="fal fa-desktop" />
							<NavLinkText>Develop</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							to="/photo"
							className={isNavLinkActiveHelper}
							title="Photography Portfolio"
						>
							<NavLinkIcon className="fal fa-camera" />
							<NavLinkText>Photo</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							end
							to="/about"
							className={isNavLinkActiveHelper}
							title="About"
						>
							<NavLinkIcon className="fal fa-user" />
							<NavLinkText>About</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							end
							to="/contact"
							className={isNavLinkActiveHelper}
							title="Contact"
						>
							<NavLinkIcon className="fal fa-envelope" />
							<NavLinkText>Contact</NavLinkText>
						</StyledNavLink>
					</NavLinkContainer>
					<NavSocialLinkContainer>
						<NavSocialLink
							href="https://www.github.com/andrevitalb"
							className="navbar__socialLink"
							rel="noreferrer"
							target="_blank"
							title="GitHub"
						>
							<i className="fab fa-github" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.linkedin.com/in/andrevitalb/"
							className="navbar__socialLink"
							rel="noreferrer"
							target="_blank"
							title="LinkedIn"
						>
							<i className="fab fa-linkedin-in" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.instagram.com/im_andrevital"
							className="navbar__socialLink"
							rel="noreferrer"
							target="_blank"
							title="Instagram"
						>
							<i className="fab fa-instagram" />
						</NavSocialLink>
						<NavSocialLink
							href="https://www.twitter.com/andrevitalb"
							className="navbar__socialLink"
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
