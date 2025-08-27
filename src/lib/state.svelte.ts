export type UserMetadata = {
    name: string,
    phone: string,
    email: string
    // If this ever gets changed, remember to update handleSessionCreated in Chatbox.svelte
}
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
    greetings: {
        bubble: string,
        message: string
    }
    metadata: {
        companyName: string,
        companyLogo: string,
    }
}

export const chatState = $state({
    unread: 0 as number,
    messenger: [] as Message[],
    isChatboxOpen: false as boolean
});
export const chatConfig = $state({} as Config);