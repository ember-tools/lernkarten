import {createRouter, type RouteRecordRaw, type RouterHistory} from 'vue-router'

/** The routes of the tool; public ones are prerendered and listed in `PUBLIC_PATHS`. */
export const routes: RouteRecordRaw[] = [
    {path: '/', name: 'Landing', component: () => import('../views/LandingView.vue'), meta: {public: true}},
    {path: '/hilfe', name: 'Help', component: () => import('../views/HelpView.vue'), meta: {public: true}},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue'),
        meta: {titleKey: 'routes.notFound'}},
]

/** The tool's router, with web history in the browser and memory history when prerendering. */
export function createAppRouter(history: RouterHistory) {
    return createRouter({history, routes})
}
