const express=require('express')
const Router=express.Router();
const joi=require('joi')
const validator=require('express-joi-validation').createValidator({})
const {controller}=require('../controllers/auth/authcontroller');
const auth = require('../middleware/auth');

const registerschema=joi.object({
    username:joi.string().min(4).max(15).required(),
    password:joi.string().min(5).required(),
    email:joi.string().email().required()
})

const loginschema=joi.object({
    password:joi.string().min(5).required(),
    email:joi.string().email().required()
})


Router.post('/login',validator.body(loginschema),controller.logincontroller)

Router.post('/Register',validator.body(registerschema),controller.registercontoller)
Router.get('/test',auth,(req,res)=>{
    res.send('token passed')
})
module.exports=Router