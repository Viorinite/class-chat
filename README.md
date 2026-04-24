# Class Chat

A minimal classroom chat app for one shared room. It uses Express, Socket.io, and a static HTML/CSS/JS frontend.

The app has no accounts, database, multiple rooms, uploads, or admin panel. Students join with their real name and the shared room password.

## Local Development

Install dependencies:

```sh
npm install
```

Set a room password:

```sh
ROOM_PASSWORD=change-me npm start
```

For normal local development, you can also put `ROOM_PASSWORD` in a local `.env` file. The app listens on port `3000`.

## Docker Compose

Create a local environment file:

```sh
cp .env.example .env
```

Fill in `ROOM_PASSWORD`. Leave `TUNNEL_TOKEN` empty unless you are running Cloudflare Tunnel.

Run the app locally:

```sh
docker compose up --build
```

The app will be available on port `3000`.

## Cloudflare Tunnel

The tunnel service is optional and uses the `tunnel` Compose profile:

```sh
docker compose --profile tunnel up --build
```

Set `TUNNEL_TOKEN` in `.env` before using the tunnel profile. The Cloudflare Tunnel public hostname `chat.nicky.my.id` should route to `http://app:3000` inside the Compose network.
