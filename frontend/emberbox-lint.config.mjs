/**
 * What the script linters read: the frontend and its configs and the backend, and for the em dash
 * also the styles, the page shell, the build and CI files and the README. Paths are relative to the
 * repository root.
 */
export default {
    root: '..',
    sources: [
        {path: 'frontend/src', extensions: ['.ts', '.vue']},
        {path: 'frontend/eslint.config.mjs', extensions: null},
        {path: 'frontend/emberbox-lint.config.mjs', extensions: null},
        {path: 'frontend/vite.config.ts', extensions: null},
        {path: 'backend/src', extensions: ['.py']},
    ],
    text: [
        {path: 'frontend/src', extensions: ['.css']},
        {path: 'frontend/index.html', extensions: null},
        {path: 'Dockerfile', extensions: null},
        {path: '.github', extensions: ['.yml']},
        {path: 'toolchain.sh', extensions: null},
        {path: 'README.md', extensions: null},
    ],
    browserStorage: {catalogue: 'frontend/browser-storage.json', sources: 'frontend/src'},
    duplication: '.jscpd.json',
}
