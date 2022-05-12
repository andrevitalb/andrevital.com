import { LinkButton } from "components/common/button/LinkButton"

export const NotFound = () => {
	return (
		<div tw="flex flex-col items-center justify-center w-full h-screen object-cover">
			<div tw="absolute top-0 left-0 w-full h-full z-[-1] bg-opacity-70 bg-black" />
			<img
				src="/images/404.gif"
				alt="Not found"
				tw="absolute top-0 left-0 z-[-2] w-full max-h-screen"
			/>
			<i tw="text-7xl" className="fal fa-flushed" />
			<h1 tw="text-4xl font-bold mt-3 mb-1">Whoops,</h1>
			<h2 tw="text-3xl font-bold mb-6">
				I haven't actually coded this one, my bad :(
			</h2>
			<LinkButton href="/" tw="flex items-center justify-center">
				<i className="fal fa-arrow-left" />
				<p tw="ml-2">Go back home</p>
			</LinkButton>
		</div>
	)
}
