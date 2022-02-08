export const CustomScrollbar = ({ size }: { size: string }) => `
	&::-webkit-scrollbar {
		width: ${size || "5px"};
		height: ${size || "5px"};
		border-radius: ${size || "5px"};
	}

	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: ${size || "5px"};
	}

	&::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: ${size || "5px"};
	}

	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`

export const AfterBar = ({
	width,
	height,
	color,
}: {
	width: string
	height: string
	color: string
}) => `
    &::after {
        content: '';
        display: block;
        margin-top: 1.5rem;
        width: ${width};
        height: ${height};
        background-color: ${color};
    }
`

export const baseTransition = (duration?: string) => `
	transition: all ease-in-out;
	transition-duration: ${duration ?? "300ms"};
`

export const absolutePositionCenter = `
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`
