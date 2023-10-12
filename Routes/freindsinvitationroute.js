const express=require('express')
const auth = require('../middleware/auth')
const usermodel = require('../models/usermodel')
const postivitation = require('../controllers/invitation/postinvitation')
const acceptinvitation = require('../controllers/invitation/acceptinvitation')
const rejectinvitation = require('../controllers/invitation/rejectinvitatio')
const router=express.Router()

router.post('/invitation',auth,postivitation
)
router.put('/accept',auth,acceptinvitation)
router.delete('/reject',auth,rejectinvitation)
module.exports=router
