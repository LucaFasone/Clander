import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { calendar } from './routes/calendar'
const app = new Hono()
app.use(logger())
app.basePath('/api').route('/calendar', calendar)

serve({
  fetch: app.fetch,

})
