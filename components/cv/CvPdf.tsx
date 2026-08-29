import {
	Document,
	Link,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer"
import { type Cv, formatMonthYear, formatPeriod, parseEmphasis } from "@/lib/cv"

// Helvetica, Helvetica-Bold and Helvetica-Oblique ship with the PDF spec, so
// the document embeds no font files and the script needs no network at build
// time. A branded face is a later decision, not a pipeline one.
const styles = StyleSheet.create({
	page: {
		paddingTop: 34,
		paddingBottom: 40,
		paddingHorizontal: 42,
		fontFamily: "Helvetica",
		fontSize: 8.8,
		lineHeight: 1.32,
		color: "#1a1a1a",
	},
	name: {
		fontFamily: "Helvetica-Bold",
		fontSize: 18,
		textAlign: "center",
	},
	contact: {
		marginTop: 5,
		fontSize: 8.5,
		textAlign: "center",
		color: "#444444",
	},
	sectionTitle: {
		fontFamily: "Helvetica-Bold",
		fontSize: 10,
		letterSpacing: 1.2,
		marginTop: 11,
		marginBottom: 4,
		paddingBottom: 2,
		borderBottomWidth: 0.75,
		borderBottomColor: "#bbbbbb",
	},
	entry: { marginTop: 6 },
	row: { flexDirection: "row", justifyContent: "space-between" },
	// react-pdf styles Link as blue and underlined by default, which reads as a
	// web link in a document meant to be printed. The company name is the anchor
	// either way; the URL is a bonus for whoever opens it on screen.
	company: {
		fontFamily: "Helvetica-Bold",
		fontSize: 10.5,
		color: "#1a1a1a",
		textDecoration: "none",
	},
	position: { fontFamily: "Helvetica-Oblique" },
	muted: { color: "#555555" },
	bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 8 },
	bulletMark: { width: 10 },
	bulletText: { flex: 1 },
	bold: { fontFamily: "Helvetica-Bold" },
	languages: { flexDirection: "row", gap: 24, marginTop: 4 },
	footer: {
		position: "absolute",
		bottom: 20,
		left: 42,
		right: 42,
		fontSize: 8,
		textAlign: "right",
		color: "#888888",
	},
})

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

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<View>
			<Text style={styles.sectionTitle}>{title}</Text>
			{children}
		</View>
	)
}

export function CvPdf({ cv }: { cv: Cv }) {
	const { profile } = cv
	const contact = [profile.email, ...profile.links.map((link) => link.url)]
		.map((value) => value.replace(/^https?:\/\//, "").replace(/\/$/, ""))
		.join("  ·  ")

	return (
		<Document
			title={`${profile.name}, CV`}
			author={profile.name}
			subject={profile.headline}
		>
			<Page size="LETTER" style={styles.page}>
				<Text style={styles.name}>{profile.name}</Text>
				<Text style={styles.contact}>{contact}</Text>

				<Section title="EXPERIENCE">
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
								<Text style={styles.muted}>{entry.location}</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.position}>{entry.position}</Text>
								<Text style={styles.muted}>{formatPeriod(entry)}</Text>
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
					<Section title="EDUCATION">
						{cv.education.map((entry) => (
							<View key={entry.degree} style={styles.row}>
								<Text>
									<Text style={styles.bold}>{entry.institution}</Text>
									{`, ${entry.degree}`}
								</Text>
								<Text style={styles.muted}>
									{formatMonthYear(entry.graduated)}
								</Text>
							</View>
						))}
					</Section>
				)}

				{cv.languages.length > 0 && (
					<Section title="LANGUAGES">
						<View style={styles.languages}>
							{cv.languages.map((language) => (
								<Text key={language.name}>
									<Text style={styles.bold}>{`${language.name}: `}</Text>
									{language.level}
								</Text>
							))}
						</View>
					</Section>
				)}

				<Section title="REFERENCES">
					<Text>{cv.references}</Text>
				</Section>

				<Text
					style={styles.footer}
					render={({ pageNumber }) => `${profile.name} - ${pageNumber}`}
					fixed
				/>
			</Page>
		</Document>
	)
}
