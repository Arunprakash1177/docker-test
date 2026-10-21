# Server Checklist

A tiny task-list web app for server jobs, built with Node.js and Express.
Tasks are saved in a JSON file, so they survive restarts.

## How it works

- `server.js` starts a web server and exposes a small JSON API.
- `public/index.html` is the page that talks to the API.
- Tasks are stored in one file, `tasks.json`, inside the data folder.

## Settings (environment variables)

| Name       | Default            | Meaning                                 |
|------------|--------------------|-----------------------------------------|
| `PORT`     | `3000`             | Port the web server listens on          |
| `HOST`     | `127.0.0.1`        | Network address the web server binds to |
| `DATA_DIR` | `./data` (project) | Folder where `tasks.json` is stored     |

The app creates the data folder itself if it does not exist.

## Run it natively (needs Node.js 18 or newer)

    npm ci
    npm start

Then open http://127.0.0.1:3000

`npm ci` installs the exact versions listed in `package-lock.json`.

## Health check

    GET /health   ->   {"status":"ok"}
