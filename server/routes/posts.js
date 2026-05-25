const express = require('express')
const router = express.Router()
const pool = require('../db')
const upload = require('../config/multer')
const cloudinary = require('../config/cloudinary')

router.post('/', upload.array('images'), async(req, res)=>{
    const {title, body, latitude, longitude, location_name, is_public} = req.body;
    const id = req.user.id;

    const query = `INSERT INTO posts (user_id, title, body, latitude, longitude, location_name, is_public)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
    const values = [id, title, body, latitude, longitude, location_name, is_public]
    const result = await pool.query(query, values)

    const photos = req.files

    for(const photo of photos){
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'geojour' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(photo.buffer)
        })
        const url = uploadResult.secure_url
        const query = `INSERT INTO post_photos (post_id, photo_url, caption, order_index)
        VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [result.rows[0].id, url, req.body.caption, req.body.order_index]
        const photoResult = await pool.query(query, values)
    }
    res.status(201).json(result.rows[0])
})

router.get('/', async(req, res)=>{
    const id = req.user.id
    const query = "SELECT * FROM posts WHERE user_id=$1"
    const result = await pool.query(query, [id])
    res.status(200).json(result.rows)
})

router.get('/:id', async(req, res)=>{
    const id = req.params.id
    const user_id = req.user.id
    const query = "SELECT * FROM posts WHERE user_id=$1 AND id=$2"
    const result = await pool.query(query, [user_id, id])
    res.status(200).json(result.rows[0])
})

router.delete('/:id', async(req, res)=>{
    const id = req.params.id
    const user_id = req.user.id
    const query = "DELETE FROM posts WHERE user_id=$1 AND id=$2"
    await pool.query(query, [user_id, id])
    res.status(200).json({"message":"Post Deleted"})
})

router.post('/:id/photos', async (req, res) => {
    const photos = req.files

    for(const photo of photos){
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'geojour' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(photo.buffer)
        })
        const url = uploadResult.secure_url
        const query = `INSERT INTO post_photos (post_id, photo_url, caption, order_index)
        VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [req.params.id, url, req.body.caption, req.body.order_index]
        const result = await pool.query(query, values)
    }
    res.status(201).json(result.rows[0])
})

module.exports = router