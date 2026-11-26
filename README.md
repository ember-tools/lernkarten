# Lernkarten

A learning tool for fire services: tactical signs after the recommendations of the BBK (2024) and
the marking of dangerous goods after ADR, with spaced repetition, quizzes and reference pages. It
runs in the browser; progress stays on the device, and the server keeps nothing.

The interface is German throughout; it is meant for German fire services. The signs, danger labels
and plates are drawn by [`@emberbox/ui`](https://github.com/ember-tools/emberbox).

## Running it

The image is `ghcr.io/ember-tools/lernkarten`. `compose.yml` builds and starts it locally on port
8080; `compose.dev.yml` runs the backend with reload and Vite on port 5177.

```sh
./toolchain.sh verify      # backend tests, frontend tests, type check and build
./toolchain.sh be-serve    # build the frontend and serve everything on port 8000
```

### Behind Traefik

`compose.prod.yml` is a template for running the image behind an existing Traefik (v3.1 or later)
with TLS. Set the variables in an `.env` file beside it or in the environment:

| Variable | Default | Meaning |
|---|---|---|
| `LERNKARTEN_HOST` | required | Public host name, e.g. `lernkarten.example.org`; also sets `CORS_ORIGINS` |
| `PROXY_NETWORK` | `proxy` | External Docker network Traefik is attached to |
| `TRAEFIK_ENTRYPOINT` | `websecure` | Traefik entrypoint for HTTPS |
| `TRAEFIK_CERT_RESOLVER` | `letsencrypt` | Traefik certificate resolver |

The template turns off Traefik's access log for this router. The server stores nothing, so there is
no volume.

### Environment

| Variable | Default | Meaning |
|---|---|---|
| `CORS_ORIGINS` | `*` | Comma separated allowed origins; `https://lernkarten.emberbox.app` in production |
| `LOG_FORMAT` | `json` in the image | `json` writes ECS JSON lines to stdout |
| `LOG_LEVEL` | `INFO` | Log level when `LOG_FORMAT=json` |
| `FORWARDED_ALLOW_IPS` | `*` in the image | Proxies whose `X-Forwarded-*` headers uvicorn trusts; narrow it to the proxy's addresses |

The container listens on port 8000. It serves the prerendered public pages for search engines and
the single page app with `noindex` for everything else; `/api/health` answers the health check.

## Licence

AGPL-3.0-or-later, see `LICENSE`.
