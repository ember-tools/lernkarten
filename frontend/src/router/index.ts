import {createRouter, type RouteRecordRaw, type RouterHistory} from 'vue-router'
import {FORMER_SIGN_DECKS, SIGN_DECK_ID} from '../areas/signs'
import {filterQuery} from '../areas/signs/filter'

/** The fixed sign decks of earlier versions, which lead to the sign deck with the choice each stood for. */
const FORMER_SIGN_DECK_ROUTES: RouteRecordRaw[] = ['lernen', 'quiz'].flatMap(page => Object.entries(FORMER_SIGN_DECKS)
    .map(([id, filter]) => ({path: `/${page}/${id}`, redirect: {path: `/${page}/${SIGN_DECK_ID}`, query: filterQuery(filter)}})))

/** The routes of the tool; public ones are prerendered and listed in `PUBLIC_PATHS`. */
export const routes: RouteRecordRaw[] = [
    {path: '/', name: 'Landing', component: () => import('../views/LandingView.vue'), meta: {public: true}},
    {path: '/hilfe', name: 'Help', component: () => import('../views/HelpView.vue'), meta: {public: true}},
    {path: '/zeichen', name: 'Signs', component: () => import('../views/SignsView.vue'), meta: {public: true}},
    {path: '/zeichen/auswahl', name: 'SignSelection', component: () => import('../views/SignSelectionView.vue'),
        meta: {titleKey: 'routes.signSelection'}},
    {path: '/zeichen/:chapter', name: 'SignChapter', component: () => import('../views/SignChapterView.vue'), meta: {public: true}},
    {path: '/gefahrnummern', name: 'HazardNumbers', component: () => import('../views/HazardNumbersView.vue'), meta: {public: true}},
    {path: '/gefahrzettel', name: 'DangerLabels', component: () => import('../views/DangerLabelsView.vue'), meta: {public: true}},
    {path: '/un-nummern', name: 'UnNumbers', component: () => import('../views/UnNumbersView.vue'), meta: {public: true}},
    {path: '/quellen', name: 'Sources', component: () => import('../views/SourcesView.vue'), meta: {public: true}},
    ...FORMER_SIGN_DECK_ROUTES,
    {path: '/lernen/:deck', name: 'Learn', component: () => import('../views/LearnView.vue'), meta: {titleKey: 'routes.learn'}},
    {path: '/quiz/:deck', name: 'Quiz', component: () => import('../views/QuizView.vue'), meta: {titleKey: 'routes.quiz'}},
    {path: '/lernstand', name: 'Progress', component: () => import('../views/ProgressView.vue'), meta: {titleKey: 'routes.progress'}},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue'),
        meta: {titleKey: 'routes.notFound'}},
]

/** The tool's router, with web history in the browser and memory history when prerendering. */
export function createAppRouter(history: RouterHistory) {
    return createRouter({history, routes})
}
