import Link from "next/link"
import tw, { styled } from "twin.macro"
import {
	AboutHeader,
	AboutText,
	TechStackBullet,
	TechStackList,
	TextHighlightLink,
	textHighlightLinkStyles,
} from "./about.atoms"

export const AboutInfo = () => {
	return (
		<section tw="flex justify-center items-center min-h-screen h-full w-full">
			<div tw="grid grid-cols-1 md:[grid-template-columns:1fr_max-content] w-[clamp(340px, 75vw, 320px)] md:w-[clamp(1300px, 55vw, 900px)]">
				<ContentContainer>
					<div>
						<AboutHeader>About Me</AboutHeader>
						<AboutText>
							Hi! My name is André and I enjoy creating things that live on the
							internet. My first contact with web development was way back in
							2012 when I did my first web page (just the basic HTML & CSS
							stuff), but I inmediately fell in love with it!
						</AboutText>
						<AboutText>
							Fast-forward to today, and I've had the privilege of working at{" "}
							<TextHighlightLink
								href="https://www.originate.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								an agile innovation firm
							</TextHighlightLink>
							,{" "}
							<TextHighlightLink
								href="https://www.saatchiart.com/"
								target="_blank"
								rel="noopener noreferrer"
							>
								a global art marketplace
							</TextHighlightLink>
							,{" "}
							<TextHighlightLink
								href="https://www.goflip.ai/"
								target="_blank"
								rel="noopener noreferrer"
							>
								an intelligent fleet management platform
							</TextHighlightLink>
							,{" "}
							<TextHighlightLink
								href="https://www.quintech.mx/"
								target="_blank"
								rel="noopener noreferrer"
							>
								a software development start-up
							</TextHighlightLink>{" "}
							and{" "}
							<TextHighlightLink
								href="https://www.yellowpath.mx/"
								target="_blank"
								rel="noopener noreferrer"
							>
								a digital branding company
							</TextHighlightLink>
							. Nowadays, I'm actively engaged in personal projects and handling
							small client assignments simultaneously.
						</AboutText>
						<AboutText>
							Here are a few technologies I've been working with recently:
						</AboutText>
						<TechStackList>
							<TechStackBullet>React</TechStackBullet>
							<TechStackBullet>NodeJS</TechStackBullet>
							<TechStackBullet>TypeScript</TechStackBullet>
							<TechStackBullet>JavaScript (ES6+)</TechStackBullet>
							<TechStackBullet>NextJS</TechStackBullet>
							<TechStackBullet>NestJS</TechStackBullet>
							<TechStackBullet>PostgreSQL</TechStackBullet>
							<TechStackBullet>GraphQL</TechStackBullet>
							<TechStackBullet>AWS</TechStackBullet>
						</TechStackList>
						<AboutText>
							When away from the keyboard, I'm probably either making some nice
							iced coffee (big source of life) or out taking some photos/videos.
							I particullarly enjoy doing concert/festival photography, for
							which you can check out my portfolio{" "}
							<StyledInsideLink href="/photo">here</StyledInsideLink>.
						</AboutText>
					</div>
				</ContentContainer>
				<ContentContainer>
					<img tw="w-80" src="/images/logo_negative.svg" alt="André Vital" />
				</ContentContainer>
			</div>
		</section>
	)
}

const StyledInsideLink = styled(Link)`
	${textHighlightLinkStyles}
`
const ContentContainer = tw.div`col-span-1 p-4`
