import {dangerLabelTree, warningPanelTree, type DangerLabelPattern, type SvgElement} from '@emberbox/ui'

const PANEL = {width: 120, height: 90}
const LABEL = 100
const GAP = 12

/** A plate and the labels of a vehicle side by side, as one drawing. */
export function plateWithLabels(plate: {hazardNumber: string, unNumber: string}, labels: readonly string[] = []): SvgElement {
    const placed = (tree: SvgElement, x: number, y: number): SvgElement => ({...tree, attributes: {...tree.attributes, x, y}})
    const children = [
        placed(warningPanelTree(plate), 0, (LABEL - PANEL.height) / 2),
        ...labels.map((pattern, index) => placed(dangerLabelTree(pattern as DangerLabelPattern), PANEL.width + GAP + index * (LABEL + GAP), 0)),
    ]
    const width = PANEL.width + labels.length * (LABEL + GAP)
    return {tag: 'svg', attributes: {xmlns: 'http://www.w3.org/2000/svg', viewBox: `0 0 ${width} ${LABEL}`, width, height: LABEL}, children}
}
