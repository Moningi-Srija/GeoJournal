const express = require('express')
const router = express.Router()
const pool = require('../db')

router.post('/request', async(req, res)=>{
    try{
        const requester_id = req.user.id
        const addressee_id = req.body.addressee_id
        if(requester_id == parseInt(addressee_id)){
            return res.status(400).json({message: "Can't send request to yourself"})
        }
        const query = `INSERT INTO friendships 
        (requester_id, addressee_id)
        VALUES ($1, $2)
        RETURNING *`
        const response = await pool.query(query, [requester_id, addressee_id])
        res.status(201).json(response.rows[0])
    }
    catch(e){
        if(e.code === '23505'){
            return res.status(400).json({'message':'Friend request already sent'})
        }
        res.status(500).json({'message':'Server Error'})
    }
})

router.put('/:id/accept', async(req, res)=>{
    const requester_id = req.params.id
    const addressee_id = req.user.id
    const status = "accepted"
    const query = `UPDATE friendships SET status = $1 
    WHERE requester_id=$2 AND addressee_id=$3
    RETURNING *`
    const response = await pool.query(query, [status, requester_id, addressee_id])
    res.status(200).json(response.rows[0])
})

router.delete('/:id', async(req, res)=>{
    const other_id = req.params.id
    const my_id = req.user.id
    const query = `DELETE FROM friendships
    WHERE (requester_id=$1 AND addressee_id=$2)
    OR (requester_id=$2 AND addressee_id=$1)`
    await pool.query(query, [my_id, other_id])
    res.status(200).json({"msg": "Rejected/Deleted friend request"})
})

router.get('/', async(req, res)=>{
    const my_id = req.user.id
    const query = `SELECT users.* FROM users
    JOIN friendships
    ON ((requester_id = users.id AND addressee_id = $1)
    OR (addressee_id = users.id AND requester_id = $1))
    WHERE friendships.status = 'accepted'`
    const response = await pool.query(query, [my_id])
    res.status(200).json(response.rows)
})

router.get('/requests/sent', async(req, res)=>{
    const requester_id = req.user.id
    const query = ` SELECT username, users.id FROM users
    JOIN
    (SELECT * FROM friendships
    WHERE requester_id = $1 AND status = 'pending') requests
    ON users.id = requests.addressee_id`
    const result = await pool.query(query, [requester_id])
    res.status(200).json(result.rows)
})

router.get('/requests/received', async(req, res)=>{
    const addressee_id = req.user.id
    const query = `SELECT username, users.id FROM users
    JOIN
    (SELECT * FROM friendships
    WHERE addressee_id = $1 AND status = 'pending') requests
    ON users.id = requests.requester_id`
    const result = await pool.query(query, [addressee_id])
    res.status(200).json(result.rows)
})

module.exports = router