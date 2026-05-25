const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res)=>{
    const user_id = req.user.id
    const query = `SELECT posts.*, photos.photo_url
    FROM posts
    LEFT JOIN (
        SELECT DISTINCT ON (post_id) *
        FROM post_photos
        ORDER BY post_id, order_index
    ) photos ON posts.id = photos.post_id
    WHERE posts.user_id = $1 
    OR posts.user_id IN (
        SELECT requester_id FROM friendships
        WHERE addressee_id = $1 AND status = 'accepted'
        UNION
        SELECT addressee_id FROM friendships
        WHERE requester_id = $1 AND status = 'accepted'
    )`
    const result = await pool.query(query, [user_id])
    res.status(200).json(result.rows)
})

module.exports = router
