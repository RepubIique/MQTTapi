const express = require('express');
const db = require('../db');
const router = express.Router();


// Testing
router.get('/listusers', async(req, res)=>{
    try{
        let results = await db.getAllUsers();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/createaccount/', async(req, res)=>{
    try{
        let results = await db.createUser(req.body);
        if(!isEmpty(results))
            res.json({ msg: 'Account created', results});
        else
            res.json({msg: 'Unable to create account', results});
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.post('/login/', async(req, res)=>{
    try{
        let results = await db.login(req.body);
        if(!isEmpty(results))
            res.json({ msg: 'Login successfully', results});
        else
            res.json({msg: 'Email or password incorrect', results});
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

router.get('/listproducts', async(req, res)=>{
    try{
        let results = await db.getAllProducts();
        res.json(results);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})



const isEmpty = (obj) =>{
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


module.exports = router;