import {describe, expect, it} from 'vitest'
import {routes} from './index'
import {PUBLIC_PATHS} from './public-paths'

describe('routes', () => {
    it('prerenders exactly the public routes', () => {
        const publicRoutes = routes.filter(route => route.meta?.public === true).map(route => route.path)
        expect([...publicRoutes].sort()).toEqual([...PUBLIC_PATHS].sort())
    })

    it('gives every app route a title', () => {
        for (const route of routes.filter(route => route.meta?.public !== true)) expect(route.meta?.titleKey, route.path).toBeTruthy()
    })
})
