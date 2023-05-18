const express = require ('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')

//post
router.post ('/users' , (req , res) => {
    console.log(req.body)
    const user = new User (req.body)
    user.save()
    .then ((user) => res.status(200).send(user))
    .catch((e)=> res.status(400).send(e))
})

// get 
router.get('/users',(req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

//get by id 
router.get('/users/:id',(req,res)=>{
    const idid = req.params.id

    User.findById(idid).then((user)=>{
        if(!user){
           return res.status(404).send('User not found')
        }else{
        res.status(200).send(user)
    }
    }).catch((e)=>res.status(500).send(e))
})

// patch 
router.patch('/users/:id',async(req,res)=>{
    try{
        const idid = req.params.id
        const update = Object.keys (req.body)

        const user = await User.findById (idid)
        if(!user){
            return res.status(404).send('User not found')
        }

        update.forEach((element) => (user[element] = req.body[element])) 
        await user.save()
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// delete 
router.delete('/users/:id',async(req,res)=>{
    try{
        const idid = req.params.id
        const user = await User.findByIdAndDelete(idid)
        if(!user){
           return res.status(404).send('User not found')
        } else{
            res.status(200).send(user)
        }
    }
    catch(e){
        res.status(500).send(e)
    }
    })

// login : 
router.post('/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({ user , token})
    } catch(e){
        res.status(400).send(e.message)
    }
})

module.exports = router 

////////////////
router.post ('/users' , async (req , res) => {
    try {
        const user = new User (req.body)
        const token = await user.generateToken()
        await user.save()
         res.status(200).send({user , token})
    } catch (e) {
        res.status(400).send(e)
    }
})
///////////////////////
// Profile : 
router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.user)
})
//////////////////////////////////////////////////////////////////////////////////////////

// logout :
router.delete('/logout',auth,async(req,res)=>{
    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})
////////////////////////////////////////////////////////////////////////////////////////////
// logoutall :

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})
////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router 
