import { ButtonProps, conditionalButtonStyles } from "components/common/button"
import Link from "next/link"
import { styled } from "twin.macro"

export const ExternalLinkButton = styled.a<ButtonProps>(
	({ color = "aquaTransparent", size = "md" }) => [
		conditionalButtonStyles({ color, size }),
	],
)

export const InternalLinkButton = styled(Link)<ButtonProps>(
	({ color = "aquaTransparent", size = "md" }) => [
		conditionalButtonStyles({ color, size }),
	],
)
