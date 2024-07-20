import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { calendar } from './routes/calendar'
import { authRoute } from './routes/auth'
import { shared } from './routes/shared'

const app = new Hono()
app.use(logger())
const apiRoutes = app.basePath('/api').route('/calendar', calendar).route("/", authRoute).route('/shared', shared)

serve({
  fetch: app.fetch,

})
console.log('Server running at http://localhost:3000')
export type ApiRoutes = typeof apiRoutes
