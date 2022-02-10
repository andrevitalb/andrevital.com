export const customScrollbar = (size?: string) => `
	scrollbar-width: thin;
	scrollbar-color: #555 #222;
	
	&::-webkit-scrollbar {
		width: ${size ?? "10px"};
		height: ${size ?? "10px"};
		border-radius: ${size ?? "10px"};
	}

	&::-webkit-scrollbar-track {
		background: #222;
		border-radius: ${size ?? "10px"};
	}

	&::-webkit-scrollbar-thumb {
		background: #555;
		border-radius: ${size ?? "10px"};
	}

	&::-webkit-scrollbar-thumb:hover {
		background: #444;
	}
`

export const afterBar = ({
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
