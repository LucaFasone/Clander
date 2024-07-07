import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { calendar } from './routes/calendar'
import { authRoute } from './routes/auth'
const app = new Hono()
app.use(logger())
app.basePath('/api').route('/calendar', calendar).route("/", authRoute)

serve({
  fetch: app.fetch,

})
