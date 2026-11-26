import {SIGN_CHAPTERS} from '../areas/signs/chapters.ts'

/** The public pages of the tool, prerendered for search engines; the learning and quiz pages are not among them. */
export const PUBLIC_PATHS = [
    '/', '/hilfe', '/zeichen', ...SIGN_CHAPTERS.map(chapter => `/zeichen/${chapter.slug}`), '/gefahrnummern', '/gefahrzettel', '/un-nummern', '/quellen',
] as const
