import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"

export const PageAnimationWrapper = ({
	routerKey,
	children,
}: {
	routerKey: string
	children: ReactNode
}) => {
	return (
		<AnimatePresence>
			<motion.div
				key={routerKey}
				initial="pageInitial"
				animate="pageAnimate"
				exit="pageExit"
				variants={{
					pageInitial: {
						left: "-100vw",
						position: "absolute",
						opacity: 0,
						transition: {
							duration: 0.3,
						},
					},
					pageAnimate: {
						left: 0,
						position: "relative",
						opacity: 1,
						transition: {
							duration: 0.3,
						},
					},
					pageExit: {
						left: "-100vw",
						position: "absolute",
						opacity: 0,
						transition: {
							duration: 0.3,
						},
					},
				}}
			>
				{/* 
					This currently has issues due to problems with @types/react.
					Check https://github.com/vercel/next.js/issues/35986 for more details
				*/}
				{/* @ts-ignore */}
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
