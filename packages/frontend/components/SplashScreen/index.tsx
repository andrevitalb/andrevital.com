import { motion } from "framer-motion"
import {
	lineLogoAnimation,
	logoTransition,
	mainLogoAnimation,
} from "./animationConfigElements"

export const SplashScreen = () => {
	return (
		<motion.div
			tw="fixed left-0 z-20 w-screen h-screen bg-gray-400 flex items-center justify-center"
			initial={{
				top: "0vw",
			}}
			animate={{
				top: "-100vw",
			}}
			transition={{
				delay: 2.95,
				duration: 1.25,
				ease: "easeInOut",
			}}
		>
			<svg
				tw="w-[45vw] md:w-[20vw]"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1000 1000"
			>
				<title>logo_negative</title>
				<motion.polygon
					className="pathA"
					{...mainLogoAnimation}
					transition={logoTransition}
					points="849.9,250 767.6,250 561.7,638.2 479.4,482.9 397,482.9 521.3,715.8 561.9,793 602.9,715.8"
				/>
				<motion.polygon
					className="pathA"
					{...mainLogoAnimation}
					transition={logoTransition}
					points="150,750 232.4,750 438.2,361.8 520.6,517.1 602.9,517.1 478.6,284.2 438,207 397.1,284.2 "
				/>
				<motion.polygon
					className="pathB"
					{...lineLogoAnimation}
					transition={logoTransition}
					points="100,700 150,638 900,300 850,363 "
				/>
				<g>
					<defs>
						<polygon
							id="SVGID_1_"
							points="413.1,517.2 416.7,515.6 479.5,487.3 483.1,485.7 502.1,521.5 498.5,523.2 435.8,551.3 432.1,553"
						/>
					</defs>
					<clipPath id="SVGID_2_">
						<use xlinkHref="#SVGID_1_" />
					</clipPath>
					<motion.polygon
						className="pathC"
						{...mainLogoAnimation}
						transition={logoTransition}
						points="849.9,250 767.6,250 561.7,638.2 479.4,482.9 397,482.9 521.3,715.8 561.9,793 602.9,715.8 	"
					/>
				</g>
				<g>
					<defs>
						<polygon
							id="SVGID_3_"
							points="498.1,478.9 501.7,477.3 564.3,449.1 568,447.4 587.2,483.4 583.5,485 520.8,513.2 517.1,514.8 		
								"
						/>
					</defs>
					<clipPath id="SVGID_4_">
						<use xlinkHref="#SVGID_3_" />
					</clipPath>
					<motion.polygon
						className="pathD"
						{...mainLogoAnimation}
						transition={logoTransition}
						points="150,750 232.4,750 438.2,361.8 520.6,517.1 602.9,517.1 478.6,284.2 438,207 397.1,284.2 	"
					/>
				</g>
			</svg>
		</motion.div>
	)
}
