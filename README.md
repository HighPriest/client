# LiveMatrix ChatBox client

A chatbox client written in Svelte, to be paired with LiveMatrix Server binary

## Using in production
Place the `.css` and `.js` files in the static files hosting directory of your application.
Attach the `.css` and `.js` files as part of your application. It is a good idea to place the CSS in the head of the application and JS at the end of the body.
```html
<head>
	<link rel="stylesheet" href="/livematrix/livematrix.css">
</head>
<body>
	...
	<script type="module" src="/livematrix/livematrix.js"></script>
</body>
```
In your application, create a `span` element with id=`livematrix`.
```
<span id="livematrix" style="display: contents"></span>
```
and we are done!

### Install as svelte component
Create a `LiveMatrix.svelte` component, as part of your Svelte application.
_If you have placed the `.js` and `.css` files directly in the `static` directory._
In this component add lines:
```
<svelte:head>
	<script type="module" src="/livematrix.min.js"></script>
	<link rel="stylesheet" href="/livematrix.css" />
</svelte:head>

<span id="livematrix" style="display: contents"></span>
```
then import this component to any part of your website and see the chatbox appear!

## Configuration
Take the sample config and modify it according to your server configuration.

### Greetings
The speech bubble being shown at the page load, can be disabled by clearing the `greetings.bubble` line from config.json

### Proto(col)
For prot(col) you really have two options, either `http`, or `https`, depending on your server configuration.
The same goes for websocket proto(col). If the LiveMatrix Server instance is behind a reverse_proxy, you are going to want to use `wss`, or `ws` when both the JS application and LiveMatrix server, run on the same, local, development machine.

### Host & Port
If you are connecting to the LiveMatrix server **through a domain name**, leave the `port` empty, to avoid errors!

### Permitting CORS
> This configuration is going to help you, if you need to host the **LiveMatrix Server** under a different domain / IP, or access server from dev instance
#### Caddy reverse proxy
```Caddyfile
(cors) { // Put this macro on top of your configuration file
	@cors_preflight method OPTIONS
	@cors header Origin {args.0}

	handle @cors_preflight {
		header Access-Control-Allow-Origin "{args.0}"
		header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE"
		header Access-Control-Allow-Headers "Content-Type, Authorization, X-CSRFToken"
		header Access-Control-Allow-Credentials "true"
		header Access-Control-Max-Age "3600"
		respond "" 204
	}

	handle @cors {
		header Access-Control-Allow-Origin "{args.0}"
		header Access-Control-Expose-Headers "Link"
		header defer
	}
}

lm_server.domain.com {
    import cors https://lm_client.example.com // Also works with http://localhost:5173, etc.
    reverse_proxy localhost:3002 { // This points to the interface bound by your livematrix server application
		header_down Set-Cookie (.*) "$1; SameSite=None; Secure"
		header_down Access-Control-Allow-Credentials "true"
	}
}
```

## Development
> Follow contents of [[CONTRIBUTING.md]] for details

To make a standalone application, we can use the command attached to `package.json`
```
pnpm run standalone
```
which is going to make separate, minified .js and .css files, to be included as part of our website.