import path from "node:path"
import {
	Document,
	Font,
	Link,
	Page,
	StyleSheet,
	Text,
	type TextProps,
	View,
} from "@react-pdf/renderer"
import { type Cv, formatMonthYear, formatPeriod, parseEmphasis } from "@/lib/cv"

/*
 * Typography follows the CV of record (docs/cv-2026-08): a serif in faux small
 * caps for the name and the section rules, a humanist sans for everything else,
 * dates and locations set flush right.
 *
 * The source justifies its body text and this does not. react-pdf's justify
 * inserts a hyphen wherever it breaks a line at the boundary between two runs,
 * and every bullet here is a chain of runs because `**bold**` splits it, so
 * "React, Gatsby, Node.js-" is what came out. The hyphenation callback below
 * does not reach it. A ragged right edge beats a wrong hyphen on a CV.
 *
 * That document is set in Georgia and Tahoma, neither of which can be shipped
 * here: they are Microsoft's, they are not among the fourteen fonts a PDF
 * viewer is required to have, and react-pdf can only reference a face it can
 * embed. Gelasio is metric-compatible with Georgia; Open Sans stands in for
 * Tahoma, which has no open equivalent. Both are OFL and vendored under
 * assets/fonts, so the build reads them off disk and still needs no network.
 */
const fontDir = path.join(process.cwd(), "assets", "fonts")

// Never hyphenate. There is no dictionary for Open Sans here, so react-pdf's
// default hyphenator guesses, and a CV is the wrong place for "continu-ous".
Font.registerHyphenationCallback((word) => [word])

Font.register({
	family: "Serif",
	fonts: [
		{ src: path.join(fontDir, "Gelasio-Regular.ttf") },
		{ src: path.join(fontDir, "Gelasio-Bold.ttf"), fontWeight: 700 },
	],
})

Font.register({
	family: "Sans",
	fonts: [
		{ src: path.join(fontDir, "OpenSans-Regular.ttf") },
		{ src: path.join(fontDir, "OpenSans-Bold.ttf"), fontWeight: 700 },
		{ src: path.join(fontDir, "OpenSans-Italic.ttf"), fontStyle: "italic" },
	],
})

const NAME_SIZE = 21
const SECTION_SIZE = 10.5

const INK = "#101010"
const MUTED = "#333333"

const styles = StyleSheet.create({
	page: {
		paddingTop: 40,
		paddingBottom: 34,
		paddingHorizontal: 48,
		fontFamily: "Sans",
		fontSize: 8.3,
		lineHeight: 1.3,
		color: INK,
	},
	name: {
		fontFamily: "Serif",
		fontSize: NAME_SIZE,
		textAlign: "center",
		letterSpacing: 1.4,
	},
	contact: {
		// The masthead's air sits above this line, not below it: the gap under it
		// is the same one every section rule gets, so adding to it made the first
		// section look detached from the header rather than giving the name room.
		marginTop: 14,
		fontSize: 8.4,
		textAlign: "center",
	},
	sectionTitle: {
		fontFamily: "Serif",
		fontSize: SECTION_SIZE,
		marginTop: 12,
		paddingBottom: 1,
		borderBottomWidth: 0.6,
		borderBottomColor: "#8c8c8c",
	},
	// The section body sits a hair inside the rule, as it does in the source.
	sectionBody: { paddingLeft: 6 },
	entry: { marginTop: 5 },
	row: { flexDirection: "row", justifyContent: "space-between" },
	company: {
		fontFamily: "Sans",
		fontWeight: 700,
		fontSize: 9.6,
		color: INK,
		textDecoration: "none",
	},
	position: { fontStyle: "italic" },
	right: { color: MUTED },
	parenthetical: { fontStyle: "italic", color: MUTED },
	bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 9 },
	bulletMark: { width: 9 },
	bulletText: { flex: 1 },
	bold: { fontWeight: 700 },
	languages: { flexDirection: "row", justifyContent: "space-between" },
	footer: {
		position: "absolute",
		bottom: 18,
		left: 48,
		right: 48,
		fontSize: 8,
		textAlign: "right",
		color: MUTED,
	},
})

/**
 * Faux small caps, the way the source document does it: the first letter at
 * full size, the rest uppercased and shrunk. Neither Georgia nor Gelasio ships
 * a real small-caps cut.
 */
function SmallCaps({
	text,
	size,
	style,
}: {
	text: string
	size: number
	style?: TextProps["style"]
}) {
	return (
		<Text style={style}>
			{text.slice(0, 1).toUpperCase()}
			{/* An explicit point size, not "0.78em": react-pdf resolves a relative
			    font size to NaN inside a nested Text and silently drops the run. */}
			<Text style={{ fontSize: size * 0.78 }}>
				{text.slice(1).toUpperCase()}
			</Text>
		</Text>
	)
}

function Rich({ text }: { text: string }) {
	return (
		<>
			{parseEmphasis(text).map((span, index) => (
				<Text
					// Spans have no identity beyond their position in one fixed string.
					// biome-ignore lint/suspicious/noArrayIndexKey: index is the identity
					key={index}
					style={span.bold ? styles.bold : undefined}
				>
					{span.text}
				</Text>
			))}
		</>
	)
}

/**
 * "Los Angeles, CA (Remote)" with the parenthetical in italic, as the source
 * sets it. A location with no parenthetical passes straight through.
 */
function Place({ text }: { text: string }) {
	const match = text.match(/^(.*?)\s*(\(.+\))$/)
	if (!match) return <Text style={styles.right}>{text}</Text>

	return (
		<Text style={styles.right}>
			{`${match[1]} `}
			<Text style={styles.parenthetical}>{match[2]}</Text>
		</Text>
	)
}

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<View>
			<SmallCaps text={title} size={SECTION_SIZE} style={styles.sectionTitle} />
			<View style={styles.sectionBody}>{children}</View>
		</View>
	)
}

export function CvPdf({ cv }: { cv: Cv }) {
	const { profile } = cv
	const contact = [profile.email, ...profile.links.map((link) => link.url)]
		.map((value) => value.replace(/^https?:\/\//, "").replace(/\/$/, ""))
		.join(" · ")

	return (
		<Document
			title={`${profile.name}, CV`}
			author={profile.name}
			subject={profile.headline}
		>
			<Page size="LETTER" style={styles.page}>
				<SmallCaps text={profile.name} size={NAME_SIZE} style={styles.name} />
				<Text style={styles.contact}>{contact}</Text>

				<Section title="Summary">
					<Text style={styles.entry}>{cv.summary}</Text>
				</Section>

				<Section title="Experience">
					{cv.experience.map((entry) => (
						<View
							key={`${entry.company}-${entry.start.year}-${entry.start.month}`}
							style={styles.entry}
							wrap={false}
						>
							<View style={styles.row}>
								<Text style={styles.company}>
									{entry.url ? (
										<Link src={entry.url} style={styles.company}>
											{entry.company}
										</Link>
									) : (
										entry.company
									)}
								</Text>
								<Place text={entry.location} />
							</View>
							<View style={styles.row}>
								<Text style={styles.position}>{entry.position}</Text>
								<Text style={styles.right}>{formatPeriod(entry)}</Text>
							</View>
							{entry.bullets.map((bullet) => (
								<View key={bullet} style={styles.bullet}>
									<Text style={styles.bulletMark}>•</Text>
									<Text style={styles.bulletText}>
										<Rich text={bullet} />
									</Text>
								</View>
							))}
						</View>
					))}
				</Section>

				{cv.education.length > 0 && (
					<Section title="Education">
						{cv.education.map((entry) => (
							<View key={entry.degree} style={styles.entry}>
								<View style={styles.row}>
									<Text style={styles.bold}>{entry.institution}</Text>
									<Text style={styles.right}>
										{formatMonthYear(entry.graduated)}
									</Text>
								</View>
								<View style={styles.row}>
									<Text style={styles.position}>{entry.degree}</Text>
									{entry.location ? <Place text={entry.location} /> : null}
								</View>
							</View>
						))}
					</Section>
				)}

				{cv.languages.length > 0 && (
					<Section title="Languages">
						<View style={[styles.languages, styles.entry]}>
							{cv.languages.map((language) => (
								<Text key={language.name}>
									<Text style={styles.bold}>{`${language.name}: `}</Text>
									{language.level}
								</Text>
							))}
						</View>
					</Section>
				)}

				<Section title="References">
					<Text style={styles.entry}>{cv.references}</Text>
				</Section>

				{/*
				 * No page number. react-pdf's `render` callback, which is the only
				 * way to get one, silently drops the whole run in this document
				 * while working in isolation with the same styles and fonts. The
				 * document is one page by design, so the number earns nothing.
				 */}
				<Text style={styles.footer} fixed>
					{profile.name}
				</Text>
			</Page>
		</Document>
	)
}
