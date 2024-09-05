import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { calendar } from './routes/calendar'
import { authRoute } from './routes/auth'
import { shared } from './routes/shared'
import { modify } from './routes/modify'
import { notifications } from './routes/notifications'
import { createNodeWebSocket } from '@hono/node-ws'
import { cors } from 'hono/cors';
import { WSContext } from 'hono/ws'
import { getUser } from './kinde'
import { db } from './db'
import { sharedEvents } from './db/schema'
import { eq, or, sql } from 'drizzle-orm'
import { getUserCalendarId } from './db/Query'
import { Event } from './db/schema'
type wsMessage = {
  type: string,
  eventId: string,
  userId: string,
  event?: any,//Event
}
const app = new Hono()
app.use(logger())
const apiRoutes = app.basePath('/api').route('/calendar', calendar).route("/", authRoute).route('/shared', shared).route('/modify', modify).route('/notifications', notifications)
//i-should put this in another file dunno who tho
//this was my frist time implemnt websocket (dont like very much)
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })
const rooms: { [roomName: string]: Map<string, WSContext> } = {};

const wsApp = app.get(
  '/ws',
  getUser,
  upgradeWebSocket((c) => ({
    async onOpen(evt, ws) {
      const events = await db.select({ eventId: sharedEvents.eventId, from: sharedEvents.sharedFromUserId, to: sharedEvents.sharedToUserId }).from(sharedEvents).where(or(eq(sharedEvents.sharedFromUserId, c.var.user.id), eq(sharedEvents.sharedToUserId, c.var.user.id)))
      events.forEach((event) => {
        if (!rooms[event.eventId]) {
          rooms[event.eventId] = new Map()
        }
        if (event.from === c.var.user.id && !rooms[event.eventId].has(event.from)) {
          rooms[event.eventId].set(event.from, ws)
        }
        if (event.to === c.var.user.id && !rooms[event.eventId].has(event.to)) {
          rooms[event.eventId].set(event.to, ws)
        }
      })
      console.log(rooms);

    },
    async onMessage(evt, ws) {
      const data: wsMessage = JSON.parse(evt.data)
      //switch?
      if (data.type === 'createroom') {
        if (!rooms[data.eventId]) {
          rooms[data.eventId] = new Map()
        }
        rooms[data.eventId].set(c.var.user.id, ws)

      } else if (data.type === 'join') {
        const calendarId = await getUserCalendarId(c.var.user.id)
        const event = await db.select({
          title: Event.title,
          description: Event.description,
          date: Event.date,
          dateEnd: Event.dateEnd,
          activeReminder: Event.activeReminder,
        }).from(Event).where(sql`Event.id in (SELECT event_id FROM event_on_calendar where calendar_id = ${calendarId}) and Event.id = ${data.eventId}`).then((r) => r[0])
        rooms[data.eventId].set(data.userId, ws)
        if (ws.readyState) {
          const month = new Date(event.date).getMonth()
          console.log(rooms[data.eventId]);//what its seems that if i remove this the whole ws crash this has no sense
          rooms[data.eventId].forEach((ws) => {
            ws.send(JSON.stringify({ data: month, success: true }))
          })
        }
      }
      else if (data.type === 'modify') {
        try {
          console.log(rooms[data.eventId]);//again?....    
          rooms[data.eventId].forEach((ws) => {
            ws.send(JSON.stringify({ eventId: data.eventId, data: data.event, success: true, modify: true }))
          })
        }

        catch (e) {
          console.log(e);

        }
      }


    },
    onError(evt, ws) {
      console.error('WebSocket error:', evt)

    },
  }))
)

injectWebSocket(serve({
  fetch: app.fetch,
}))

console.log('Server running at http://localhost:3000')
export type ApiRoutes = typeof apiRoutes
export type wstype = typeof wsApp