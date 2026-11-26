import {describe, expect, it} from 'vitest'
import {createMemoryHistory} from 'vue-router'
import {createAppRouter, routes} from './index'
import {PUBLIC_PATHS} from './public-paths'

describe('routes', () => {
    const router = createAppRouter(createMemoryHistory())

    it('prerenders a public page for every public path and every public route', () => {
        const prerendered = new Set(PUBLIC_PATHS.map(path => router.resolve(path)))
        for (const route of prerendered) expect(route.meta.public, route.fullPath).toBe(true)
        const publicNames = routes.filter(route => route.meta?.public === true).map(route => route.name)
        expect(new Set([...prerendered].map(route => route.name))).toEqual(new Set(publicNames))
    })

    it('keeps the selection of signs apart from the chapters', () => {
        expect(router.resolve('/zeichen/auswahl').name).toBe('SignSelection')
        expect(router.resolve('/zeichen/gruppe').name).toBe('SignChapter')
        expect(PUBLIC_PATHS).toContain('/zeichen/gruppe')
    })

    it('leads the former sign decks to the sign deck with their choice', async () => {
        await router.push('/lernen/zeichen-grundlagen')
        expect(router.currentRoute.value.fullPath).toBe('/lernen/zeichen?fachdienst=feuerwehr&stufe=jugendfeuerwehr')
        await router.push('/quiz/zeichen-alle')
        expect(router.currentRoute.value.name).toBe('Quiz')
        expect(router.currentRoute.value.query).toEqual({fachdienst: 'feuerwehr,thw,sanitaet,fuehrung,weitere', stufe: 'fuehrung'})
    })

    it('gives every app route a title', () => {
        for (const route of routes.filter(route => route.meta?.public !== true && !route.redirect)) expect(route.meta?.titleKey, route.path).toBeTruthy()
    })
})
