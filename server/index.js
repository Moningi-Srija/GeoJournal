const express = require('express')
const cors = require('cors')
const app = express()
const authRouter = require('./routes/auth')
const authCheck = require('./middleware/auth')
const postsRouter = require('./routes/posts')
const mapRouter = require('./routes/map')
const frndsRouter = require('./routes/friends')
const usersRouter = require('./routes/users')

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : '*',
    credentials: true
}))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRouter)
app.use('/api/posts', authCheck, postsRouter)
app.use('/api/maps', authCheck, mapRouter)
app.use('/api/friends', authCheck, frndsRouter)
app.use('/api/users', authCheck, usersRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})