import { createNodeWebSocket } from "@hono/node-ws"
import { Hono } from "hono"

const wsApp = new Hono()

const {upgradeWebSocket} = createNodeWebSocket({app: wsApp})

wsApp.get('/', upgradeWebSocket((c) =>({})))


export default wsApp