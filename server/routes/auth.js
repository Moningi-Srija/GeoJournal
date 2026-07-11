const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const transporter = require('../config/mailer')
require('dotenv').config()

router.post('/register', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password, 10)

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' })
    }

    // TEMP: email verification disabled — new users are auto-verified.
    // To re-enable, restore the token + transporter.sendMail block below and
    // insert with is_verified defaulting to false.
    await pool.query(
        'INSERT INTO users (username, email, password, is_verified) VALUES ($1, $2, $3, true) RETURNING id',
        [username, email, password]
    )

    res.status(201).json({ message: 'Successfully Registered' })
})

router.get('/verify/:token', async (req, res) => {
    const { token } = req.params
    const result = await pool.query(
        'SELECT * FROM verification_tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
    )
    if (result.rows.length === 0) {
        return res.status(400).send('<h2>Link expired or invalid. Please register again.</h2>')
    }
    const user_id = result.rows[0].user_id
    await pool.query('UPDATE users SET is_verified = true WHERE id = $1', [user_id])
    await pool.query('DELETE FROM verification_tokens WHERE token = $1', [token])

    res.send(`
        <div style="font-family:sans-serif;text-align:center;padding:60px;">
            <h2 style="color:#3b82f6;">Email verified!</h2>
            <p>Your account is ready. <a href="${process.env.CLIENT_URL}">Go to GeoJournal</a></p>
        </div>
    `)
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    // TEMP: email verification check disabled — restore this block to re-enable.
    // if (!user.is_verified) {
    //     return res.status(403).json({ message: 'Please verify your email before logging in.' })
    // }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({ message: 'Login Success', token })
    } else {
        res.status(401).json({ message: 'Password Incorrect' })
    }
})

module.exports = router
