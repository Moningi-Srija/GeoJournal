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

    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
        [username, email, password]
    )
    const user_id = result.rows[0].id

    const token = crypto.randomBytes(32).toString('hex')
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await pool.query(
        'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user_id, token, expires_at]
    )

    const verifyUrl = `${process.env.SERVER_URL}/api/auth/verify/${token}`
    await transporter.sendMail({
        from: `"GeoJournal" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verify your GeoJournal account',
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Welcome to GeoJournal, ${username}!</h2>
                <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
                <a href="${verifyUrl}" style="display:inline-block;background:#3b82f6;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
                <p style="color:#999;font-size:12px;margin-top:24px;">If you didn't create an account, ignore this email.</p>
            </div>
        `
    })

    res.status(201).json({ message: 'Registered! Check your email to verify your account.' })
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

    if (!user.is_verified) {
        return res.status(403).json({ message: 'Please verify your email before logging in.' })
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({ message: 'Login Success', token })
    } else {
        res.status(401).json({ message: 'Password Incorrect' })
    }
})

module.exports = router
