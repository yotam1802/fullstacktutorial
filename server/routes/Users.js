const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
const {sign, } = require('jsonwebtoken')
const {validateToken} = require('../middleware/AuthMiddleware')

router.post('/', async (req, res) => {
    const {username, password} = req.body
    await bcrypt.hash(password, 10)
        .then((hash) => {
            Users.create({username: username, password: hash})
            res.json('Success')
        })
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    
    const user = await Users.findOne({where: { username: username }})

    if (!user) {
        res.json({Error: "User Doesn't Exist"})
    } else {
        bcrypt.compare(password, user.password)
            .then((match) => {
                if (!match) {
                    res.json({Error: "Wrong Username And Password Combination"})
                } else {
                    const accessToken = sign({username: user.username, id: user.id}, "importantsecret")
                    res.json({token: accessToken, username: user.username, id: user.id})
                }
            })
    }
})

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user)
})

module.exports = router