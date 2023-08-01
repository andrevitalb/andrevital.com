import { MarkdownTextParser } from "components/common/MarkdownTextParser"
import { ExternalLinkButton } from "components/common/button/LinkButton"
import { Tab, TabList, TabPanel, Tabs } from "components/common/tabs"
import { Job } from "lib/hooks/useJobs"
import { useEffect, useState } from "react"
import tw, { css, styled } from "twin.macro"
import { jobDatesFormatter } from "util/jobDatesFormatter"
import { AboutHeader, TechStackBullet, TextHighlightLink } from "./about.atoms"

export const CV = ({ jobs }: { jobs: Job[] }) => {
	const [selectedTab, setSelectedTab] = useState<string>("")

	useEffect(() => {
		!!jobs.length && !selectedTab && setSelectedTab(jobs[0].jobId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jobs])

	return (
		<section tw="flex justify-center items-center h-full w-full py-[100px]">
			<div tw="w-[clamp(340px, 70vw, 320px)] md:w-[clamp(1100px, 50vw, 900px)] p-6 md:py-0">
				<div tw="flex flex-col justify-center">
					<AboutHeader>Where I've worked</AboutHeader>
					<div tw="flex flex-col md:flex-row mt-2">
						{!!jobs.length && (
							<Tabs selectedTab={selectedTab} onSelect={setSelectedTab}>
								<TabList>
									<div tw="z-[3] w-full flex flex-row flex-wrap md:(flex-col flex-nowrap w-max)">
										{jobs.map(({ jobId, companyName }) => (
											<StyledTab key={jobId} tabName={jobId}>
												<p>{companyName.split(" ")[0]}</p>
											</StyledTab>
										))}
									</div>
								</TabList>
								<div tw="px-6 py-3 min-h-[420px]">
									{jobs.map(
										({
											jobId,
											companyName,
											companyPageUrl,
											position,
											startDate,
											endDate,
											descriptionBullets,
										}) => (
											<TabPanel key={jobId} tabName={jobId}>
												<CVListHeader>
													<span>{position}</span>{" "}
													<span tw="text-aqua-300">
														@{" "}
														<TextHighlightLink
															href={companyPageUrl}
															target="_blank"
															rel="noopener noreferrer"
														>
															{companyName}
														</TextHighlightLink>
													</span>
												</CVListHeader>
												<p tw="text-gray-200 text-lg font-display mb-3">
													{jobDatesFormatter(startDate, endDate)}
												</p>
												<CVDescriptionBulletList>
													{descriptionBullets.map(({ id, bullet }) => (
														<TechStackBullet key={id} tw="my-2">
															<MarkdownTextParser content={bullet} />
														</TechStackBullet>
													))}
												</CVDescriptionBulletList>
											</TabPanel>
										),
									)}
								</div>
							</Tabs>
						)}
					</div>
					<div tw="grid grid-cols-1 md:[grid-template-columns:max-content_max-content] justify-end items-center mt-4">
						<h4 tw="text-white font-semibold text-lg my-4 md:(mr-6 my-0) col-span-1 text-center">
							Want a copy?
						</h4>
						<ExternalLinkButton
							href="/docs/en/CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							tw="px-6 col-span-1 font-display text-center"
						>
							Download CV
						</ExternalLinkButton>
					</div>
				</div>
			</div>
		</section>
	)
}

const tabStyles = css`
	${tw`
		no-underline relative whitespace-nowrap
		flex items-center justify-center
		w-1/2 flex-grow px-5 py-3 bg-transparent
		border-t-[3px] border-gray-200
		md:(border-l-[3px] border-t-0 justify-start w-full)
		text-aqua-300
	`}
	&:hover {
		${tw`bg-gray-300 border-aqua-300`}
	}
`

const selectedTabStyles = css`
	${tw`border-aqua-300 bg-gray-300`}
`

const StyledTab = styled(Tab)`
	${tabStyles}
	&.selected {
		${selectedTabStyles}
	}
`

const CVListHeader = tw.h3`text-2xl text-white font-semibold`
const CVDescriptionBulletList = tw.ul`list-none text-gray-200`
