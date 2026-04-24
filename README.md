# Class Chat

A minimal classroom chat app for one shared room. It uses Express, Socket.io, and a static HTML/CSS/JS frontend.

The app has no accounts, database, multiple rooms, uploads, or admin panel. Students join with their real name and the shared room password.

## Local Development

Install dependencies:

```sh
npm install
```

Start the app with a room password:

```sh
ROOM_PASSWORD=change-me npm start
```

For normal local development, you can also put `ROOM_PASSWORD` in a local `.env` file. The app listens on port `3000`.

Open:

```text
http://localhost:3000
```

## Docker Compose

Create a local environment file:

```sh
cp .env.example .env
```

Fill in `ROOM_PASSWORD`. Leave `TUNNEL_TOKEN` empty unless you are running Cloudflare Tunnel.

Run only the app locally:

```sh
docker compose up --build
```

The default Compose profile starts only `class-chat-app`. Open:

```text
http://localhost:3000
```

To stop the local app:

```sh
docker compose down
```

If old class-chat containers from the previous Compose file are still attached to this same Compose project, remove only this project's stopped/orphan containers:

```sh
docker compose down --remove-orphans
```

That command is scoped to the `class-chat` Compose project. It does not delete unrelated homelab containers.

## Cloudflare Tunnel

The tunnel service is optional and uses the `tunnel` Compose profile:

```sh
docker compose --profile tunnel up --build
```

Set `TUNNEL_TOKEN` in `.env` before using the tunnel profile. The class-chat tunnel container is named `class-chat-cloudflared` so it does not collide with an older global `cloudflared` container.

The Cloudflare Tunnel public hostname `chat.nicky.my.id` should route to:

```text
http://app:3000
```

inside the Compose network.

## Troubleshooting

### `ROOM_PASSWORD is required`

Set `ROOM_PASSWORD` before starting the app. For Docker Compose, put it in `.env`:

```sh
ROOM_PASSWORD=change-me
```

For npm startup, either put it in `.env` or prefix the command:

```sh
ROOM_PASSWORD=change-me npm start
```

### `docker compose config` shows secrets

`docker compose config` prints resolved environment values. It is useful for local debugging, but do not share its full output publicly if `.env` contains real secrets.

### The public URL still shows The Lounge

If `http://localhost:3000` shows the new class-chat app but `chat.nicky.my.id` still shows The Lounge, the external Cloudflare Tunnel route is still pointing at the old service or old port. Update the Cloudflare Tunnel public hostname route so `chat.nicky.my.id` points to `http://app:3000` for this Compose stack.

Also check whether an older global `cloudflared` container is still running. Do not delete unrelated homelab containers just because they exist; stop or change only the tunnel that owns the old `chat.nicky.my.id` route.

### Old The Lounge or IRC containers still appear

Preview this project's containers:

```sh
docker compose ps -a
```

Then, from this repository directory, remove only containers attached to the `class-chat` Compose project:

```sh
docker compose down --remove-orphans
```

This does not affect unrelated homelab containers outside this Compose project.
