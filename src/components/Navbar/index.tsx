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
			<nav tw="h-full">
				<div tw="h-full py-4 px-2 flex flex-row md:flex-column justify-between">
					<NavLink
						to="/"
						tw="hidden md:flex justify-center items-center"
						title="Home"
					>
						<img
							src="/assets/images/logo_negative.svg"
							alt="André Vital"
							tw="w-10 transition-all duration-300 hover:scale-110 block"
						/>
					</NavLink>
					<NavLinkContainer>
						<StyledNavLink
							end
							to="/"
							className={isNavLinkActiveHelper}
							title="Home"
						>
							<NavLinkIcon className="fal fa-home-alt text-xl" />
							<NavLinkText className="navbar__link__text">
								Home
							</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							to="/develop"
							className={isNavLinkActiveHelper}
							title="Develop Portfolio"
						>
							<NavLinkIcon className="fal fa-desktop text-xl" />
							<NavLinkText className="navbar__link__text">
								Develop
							</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							to="/photo"
							className={isNavLinkActiveHelper}
							title="Photography Portfolio"
						>
							<NavLinkIcon className="fal fa-camera text-xl" />
							<NavLinkText className="navbar__link__text">
								Photo
							</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							end
							to="/about"
							className={isNavLinkActiveHelper}
							title="About"
						>
							<NavLinkIcon className="fal fa-user text-xl" />
							<NavLinkText className="navbar__link__text">
								About
							</NavLinkText>
						</StyledNavLink>
						<StyledNavLink
							end
							to="/contact"
							className={isNavLinkActiveHelper}
							title="Contact"
						>
							<NavLinkIcon className="fal fa-envelope text-xl" />
							<NavLinkText className="navbar__link__text">
								Contact
							</NavLinkText>
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
