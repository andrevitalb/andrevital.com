import { BaseStyledLinkButton } from "components/common/button/LinkButton"
import { MarkdownTextParser } from "components/common/MarkdownTextParser"
import { Tab, TabList, TabPanel, Tabs } from "components/common/tabs"
import { useJobs } from "lib/hooks/useJobs"
import { useEffect, useState } from "react"
import tw, { styled } from "twin.macro"
import { jobDatesFormatter } from "util/jobDatesFormatter"
import { AboutHeader, TechStackBullet, TextHighlightLink } from "./about.atoms"

export const CV = () => {
	const jobs = useJobs()
	const [selectedTab, setSelectedTab] = useState<string>("")

	useEffect(() => {
		jobs?.length > 0 && !selectedTab && setSelectedTab(jobs[0].jobId)
	}, [jobs])

	return (
		<section tw="flex justify-center items-center h-full w-full py-[100px]">
			<div tw="max-w-[90vw] md:max-w-[45vw] p-6 md:py-0">
				<div tw="flex flex-col justify-center">
					<AboutHeader>Where I've worked</AboutHeader>
					<div tw="flex mt-2">
						{jobs?.length > 0 && (
							<Tabs
								selectedTab={selectedTab}
								onSelect={setSelectedTab}
							>
								<TabList tw="flex">
									<div tw="z-[3] w-max">
										{jobs.map(
											({ id, jobId, companyName }) => (
												<StyledTab
													key={id}
													tabName={jobId}
												>
													<span>
														{
															companyName.split(
																" ",
															)[0]
														}
													</span>
												</StyledTab>
											),
										)}
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
										}) => {
											return (
												<TabPanel
													key={jobId}
													tabName={jobId}
												>
													<CVListHeader>
														<span>{position}</span>{" "}
														<span tw="text-aqua-300">
															@{" "}
															<TextHighlightLink
																href={
																	companyPageUrl
																}
																target="_blank"
																rel="noopener noreferrer"
															>
																{companyName}
															</TextHighlightLink>
														</span>
													</CVListHeader>
													<p tw="text-gray-200 text-lg font-display mb-3">
														{jobDatesFormatter(
															startDate,
															endDate,
														)}
													</p>
													<CVDescriptionBulletList>
														{descriptionBullets.map(
															({
																id,
																bullet,
															}) => (
																<TechStackBullet
																	key={id}
																	tw="my-2"
																>
																	<p>
																		<MarkdownTextParser
																			str={
																				bullet
																			}
																			tw="text-aqua-300"
																		/>
																	</p>
																</TechStackBullet>
															),
														)}
													</CVDescriptionBulletList>
												</TabPanel>
											)
										},
									)}
								</div>
							</Tabs>
						)}
					</div>
					<div tw="grid grid-cols-1 md:grid-template-columns[max-content max-content] justify-end items-center mt-4">
						<h4 tw="text-white font-semibold text-lg mr-6 col-span-1">
							Want a copy?
						</h4>
						<BaseStyledLinkButton
							href="/docs/en/CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							tw="px-6 col-span-1 font-display"
						>
							Download CV
						</BaseStyledLinkButton>
					</div>
				</div>
			</div>
		</section>
	)
}

const StyledTab = styled(Tab)`
	${tw`
		no-underline relative whitespace-nowrap
		flex items-center
		w-full px-5 py-3 bg-transparent
		border-l-[3px] border-gray-200
		text-aqua-300 hover:(bg-gray-300 border-aqua-300)
	`}
	&.selected {
		${tw`border-aqua-300 bg-gray-300`}
	}
`

const CVListHeader = tw.h3`text-2xl text-white font-semibold`
const CVDescriptionBulletList = tw.ul`list-none text-gray-200`
