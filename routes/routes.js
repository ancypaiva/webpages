const express = require('express')
const router =express.Router()
const Model =require('../models/model');
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
const verifyToken = require('../middlewares/middleware')
const SECRET_KEY ="NOTESAPI"

function isGmailEmail(email) {
    const regex = /@gmail\.com$/i;
    return regex.test(email);
  }
  

router.post('/signup',async(req,res) => {
    const {name,emailid,password}= req.body;
    try{
        const existingUser = await Model.findOne({ emailid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (!isGmailEmail(emailid)) {
        return res.status(400).json({ message: 'Invalid email format. Only Gmail addresses are allowed.' });
      }
    
    const hashedPassword =await bcrypt.hash(password,10)
        const data = new Model({
        name,
        password :hashedPassword,
        emailid
    });
    await data.save();
    res.status(200).json({user:data,token:token});
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

router.post('/login',async(req,res) => {
    
    const {emailid,password} = req.body
    try{
        const existingUser = await Model.findOne({emailid});
       if(!existingUser){
        return res.status(401).json({message:'Invalid credentials'})
       }
       const isPasswordValid = await bcrypt.compare(password,existingUser.password)
       if(!isPasswordValid){
        return res.status(401).json({message:'Invalid credentials'})
       }
       const token = jwt.sign({email:existingUser.emailid,id:existingUser._id},SECRET_KEY);
       res.status(201).json({user:existingUser,token:token});
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.get('/getOne/:id',verifyToken,async(req,res) => {
    try{
        const data = await Model.findById(req.params.id).select("name password");
        res.json(data)
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})

router.patch('/update/:id',async(req,res) => {
    const {name,password,emailid} = req.body;
    const userId =req.params.id;
    try{
        const user = await Model.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (emailid !== user.emailid) {
          return res.status(400).json({ message: 'Email cannot be updated' });
        }
        const hashedPassword =await bcrypt.hash(password,10)
        user.name = name;
        user.password = hashedPassword; 
    
        // Save the updated user data
        await user.save();
        return res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
})

// router.delete('/delete/:id',async(req,res) => {
//     try{
//         const id = req.params.id;
//         const data = await Model.findByIdAndDelete(id)
//         res.send(`Document with ${data.name} has been deleted`)
//     }
//     catch(error){
//         res.status(400).json({message:error.message})
//     }
// })



module.exports =router;