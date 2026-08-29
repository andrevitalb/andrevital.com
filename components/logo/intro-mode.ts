export type IntroMode = "full" | "inline"

/** Attribute the inline script writes on <html>; CSS and LogoIntro both key off it. */
export const INTRO_ATTRIBUTE = "data-intro"

/** What LogoIntro writes on <html> once the mark has docked: veil gone, page live. */
export const INTRO_DONE = "done"

/** Per-tab marker (sessionStorage) that turns the next visit into an inline draw. */
export const INTRO_MARKER = "av:intro"

/**
 * The whole decision, kept pure so the unit test and the injected script share it
 * (KTD4). A storage exception reaches this as `marked: false`, which is the first
 * visit case: a visitor whose storage is blocked sees the full intro every time,
 * which is better than never seeing it.
 */
export function decideIntroMode(
	reducedMotion: boolean,
	marked: boolean,
): IntroMode {
	return reducedMotion || marked ? "inline" : "full"
}

const MARKER = JSON.stringify(INTRO_MARKER)

/**
 * Runs as the first thing in <head>, before first paint, so the server HTML is the
 * same for every visitor and the mode is settled before any CSS keyed on it paints.
 * `decideIntroMode.toString()` is inlined so there is exactly one copy of the rule.
 */
export const introScript = `(function(){var d=document.documentElement,m="inline";try{var r=matchMedia("(prefers-reduced-motion: reduce)").matches,s=false;try{s=sessionStorage.getItem(${MARKER})==="1";sessionStorage.setItem(${MARKER},"1")}catch(e){}m=(${decideIntroMode.toString()})(r,s)}catch(e){}d.setAttribute("${INTRO_ATTRIBUTE}",m)})()`
