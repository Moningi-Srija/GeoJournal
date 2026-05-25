const express = require('express')
const bcrypt = require('bcrypt')
const pool = require(`../db`)
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

router.post('/register', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password, 10)

    const query = (`INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3);`);
    
    await pool.query(query, [username, email, password]);

    res.status(201).json({"message":"Suucessfully Registered"})
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body
    const query = `SELECT * FROM users
        WHERE email = $1;`
    const result = await pool.query(query, [email])
    
    if(result.rows.length == 0){
        res.status(404).json({"message":"User not found"})
    }
    else{
        const user = result.rows[0]
        if(await bcrypt.compare(password, user.password)){
            const secret = process.env.JWT_SECRET
            const token = jwt.sign({"id": user.id, "username": user.username}, secret, {expiresIn:'7d'})
            res.status(200).json({"message":"Login Success", "token":token})
        }
        else
        {
            res.status(401).json({"message":"Password Incorrect"})
        }
    }
})

module.exports = router