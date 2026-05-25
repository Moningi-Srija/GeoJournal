const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/search', async(req, res)=>{
    const username = req.query.q
    const query = `SELECT id, username, avatar_url FROM users
    WHERE username ILIKE '%' || $1 || '%'`
    const result = await pool.query(query, [username])
    res.status(200).json(result.rows);
})

module.exports = router