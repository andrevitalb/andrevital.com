import classNames from "classnames"
import Link, { LinkProps } from "next/link"
import { createContext, ReactNode, useContext, useMemo } from "react"

interface TabsContextValue {
	idSuffix: string
	selectedTab: string
	onSelect?: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue>(
	null as unknown as TabsContextValue,
)

const useTabs = (): TabsContextValue => {
	return useContext(TabsContext)
}

let idCounter = 0

export interface TabsProps {
	children: ReactNode
	selectedTab: string

	/**
	 * Required unless `Tab` components are given `href` props.
	 */
	onSelect?: (tabName: string) => void
}

/**
 * Used on a page where you want to display clickable tabs that switch the view
 * between different elements (called "tab panels").
 *
 * Tabs and tab panels may appear anywhere in the React tree under this
 * component - they do not need to be immediate children.
 *
 * This component is a context provider, so it must be in the React tree above
 * any use of `Tab`, `TabList`, or `TabPanel`.
 */
export const Tabs = ({ children, selectedTab, onSelect }: TabsProps) => {
	const idSuffix = useMemo(() => String(idCounter++), [])
	return (
		<TabsContext.Provider value={{ selectedTab, onSelect, idSuffix }}>
			{children}
		</TabsContext.Provider>
	)
}

export interface TabPanelProps {
	children: ReactNode
	tabName: string
	className?: string
}

/**
 * A `TabPanel` wraps an area of the page that is controlled by tabs. Clicking
 * on the tab with the same `tabName` will make this area visible; clicking on
 * a different tab will hide this area of the page.
 */
export const TabPanel = ({ children, tabName, className }: TabPanelProps) => {
	const { idSuffix, selectedTab } = useTabs()
	const selected = selectedTab === tabName
	return (
		<div
			role="tabpanel"
			id={getPanelId(tabName, idSuffix)}
			aria-labelledby={getTabId(tabName, idSuffix)}
			className={className}
			tabIndex={0}
			hidden={!selected}
		>
			{selected ? children : null}
		</div>
	)
}

export interface TabListProps {
	children: ReactNode
	className?: string
}

/**
 * Tabs should be rendered inside a `TabList`.
 */
export const TabList = ({ children, className }: TabListProps) => {
	return (
		<div role="tablist" className={className}>
			{children}
		</div>
	)
}

export interface TabProps {
	children: ReactNode
	tabName: string
	selectedClassName?: string
	className?: string

	/**
	 * Provide an href to make the tab a link instead of a button.
	 */
	href?: LinkProps["href"]
}

/**
 * This is a button that shows a corresponding element on the page. Clicking on
 * the button will show a `TabPanel` with the same `tabName`, and will hide
 * other `TabPanel` components under the same `Tabs` ancestor.
 */
export const Tab = ({
	children,
	tabName,
	selectedClassName = "selected",
	className,
	href,
}: TabProps) => {
	const { idSuffix, selectedTab, onSelect: setSelectedTab } = useTabs()
	const selected = selectedTab === tabName
	const tabProps = {
		id: getTabId(tabName, idSuffix),
		tabIndex: selected ? undefined : -1,
		className: classNames(className, selected ? selectedClassName : null),
	}
	if (href) {
		return (
			<Link href={href} passHref={true}>
				<a
					{...tabProps}
					role="tab"
					aria-selected={selected ? "true" : "false"}
					aria-controls={getPanelId(tabName, idSuffix)}
				>
					{children}
				</a>
			</Link>
		)
	}
	return (
		<button
			{...tabProps}
			role="tab"
			aria-selected={selected ? "true" : "false"}
			aria-controls={getPanelId(tabName, idSuffix)}
			type="button"
			onClick={() => setSelectedTab?.(tabName)}
		>
			{children}
		</button>
	)
}

function getPanelId(tabName: string, idSuffix: string): string {
	return getId("panel", tabName, idSuffix)
}

function getTabId(tabName: string, idSuffix: string): string {
	return getId("tab", tabName, idSuffix)
}

function getId(prefix: string, tabName: string, idSuffix: string): string {
	return `${prefix}-${tabName}-${idSuffix}`
}
