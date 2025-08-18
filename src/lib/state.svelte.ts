export type Message = {
    author: string,
    body: string
}
export type Config = {
    server: {
        proto: string,
        host: string,
        port: number
    },
    websocket: {
        proto: string,
        host: string,
        port: number
    },
    greeting: string
}

export const chatState = $state({
    unread: 0 as number,
    messenger: [] as Message[],
    isChatboxOpen: false as boolean
});
export const chatConfig = $state({} as Config);