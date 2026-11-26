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

    it('gives every app route a title', () => {
        for (const route of routes.filter(route => route.meta?.public !== true)) expect(route.meta?.titleKey, route.path).toBeTruthy()
    })
})
