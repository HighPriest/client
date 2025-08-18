# LiveMatrix ChatBox client

A chatbox client written in Svelte, to be paired with LiveMatrix Server binary

## Configuration
Take the sample config and modify it according to your server configuration.

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