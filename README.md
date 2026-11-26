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

## Data

The dangerous goods data lives in `frontend/src/data/hazmat/`:

- `hazard-numbers.json`: the hazard identification numbers of ADR 2025, 5.3.2.3.2, with their
  meanings and the meaning of each digit (5.3.2.3.1), taken from the
  [ADR 2025 excerpt of chapter 5.3](https://www.gefahrgutshop.de/fileadmin/pdfs/ADR_2025/Gefahrgutshop_ADR_2025_Kapitel_5-3_Grosszettel-Placards-an-Container-Tank-Fahrzeug-Warntafeln.pdf).
- `un.json` and `meta.json`: the list of UN numbers, imported by `./toolchain.sh data-un` from
  [chemie.de](https://www.chemie.de/lexikon/Liste_der_UN-Nummern.html), which carries the German
  Wikipedia's [Liste der UN-Nummern](https://de.wikipedia.org/wiki/Liste_der_UN-Nummern) under the
  GNU Free Documentation License; its authors are listed in the
  [article history](https://de.wikipedia.org/w/index.php?title=Liste_der_UN-Nummern&action=history).
- `common-substances.json`: a hand-kept list of common substances for the learning cards.

## Licence

AGPL-3.0-or-later, see `LICENSE`.
