/**
 * The chapters of the sign reference, each a prerendered page. Plain data, since the build reads
 * it to know which pages to prerender.
 */

/** A chapter of the reference: its address, title, which catalogue chapter it shows and how the chapter works. */
export interface SignChapter {
    slug: string
    title: string
    chapter: string
    intro: string
}

/** The chapters in the order of the recommendations. */
export const SIGN_CHAPTERS: readonly SignChapter[] = [
    {slug: 'grundelemente', title: 'Grundelemente', chapter: '1',
        intro: 'Die Grundform sagt, was etwas ist: eine taktische Formation, eine Person, ein Fahrzeug, eine Stelle, ein Gebäude, eine Gefahr oder eine Maßnahme. Alles Weitere steht in oder an dieser Form.'},
    {slug: 'farben', title: 'Farben', chapter: '2',
        intro: 'Die Farbe zeigt, zu welcher Organisation etwas gehört. Wo keine Farbe möglich ist, steht die Kurzbezeichnung der Organisation rechts unten im Zeichen.'},
    {slug: 'ergaenzungszeichen', title: 'Ergänzungszeichen', chapter: '3',
        intro: 'Ergänzungszeichen sitzen am Rand der Form: ein Balken oben für die Führung, ein Balken unten für Versorgung und Logistik, ein V für unbemannt, ein Dach für eine temporär ortsfeste Stelle.'},
    {slug: 'faehigkeiten', title: 'Fähigkeiten', chapter: '4',
        intro: 'Fähigkeiten stehen im Inneren der Form und sagen, was eine Einheit, ein Fahrzeug oder eine Stelle kann. Mehrere Fähigkeiten stapeln sich von unten nach oben, die Hauptfähigkeit unten.'},
    {slug: 'zusatzzeichen', title: 'Zusatzzeichen', chapter: '5',
        intro: 'Zusatzzeichen beschreiben Fahrzeuge genauer, zeigen Bewegungen, Stärke, Zeit, Größenordnung und Verwaltungsstufe und stellen Gefahren und Schäden dar.'},
    {slug: 'erweiterte-darstellung', title: 'Erweiterte Darstellung', chapter: '6',
        intro: 'Weitere Angaben stehen in den Feldern im und am Zeichen; Formationen werden rechts neben dem Zeichen mit einer Ziffernfolge identifiziert.'},
    {slug: 'feuerwehr', title: 'Feuerwehr (Anhang C)', chapter: 'C',
        intro: 'Einheiten und Fahrzeuge der Feuerwehr, zusammengesetzt aus Grundform, Farbe, Größenordnung, Fähigkeit und Kurzbezeichnung.'},
    {slug: 'fuehrung', title: 'Führung (Anhang D)', chapter: 'D',
        intro: 'Führungsstellen, Plätze und Führungskräfte mit Verwaltungsstufe und Herkunft.'},
]
