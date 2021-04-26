const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');



router.post('/signup',(req,res,next)=>{

    UserModel.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length >= 1){
            return res.status(409).json({
                message:"Mail Exsits"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    const user = new UserModel({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message: 'Created User Succesfully',
                        })  
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })  
                    });
                }
            });
        }
    });
});


router.post('/login',(req,res,next)=>{

    UserModel.find({email: req.body.email})
    .exec()
    .then(user =>{
       if(user.length < 1){
           return res.status(401).json({
               message: "Auth Failed"
           })
       }
       bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message: "Auth Failed"
                })
            }
            if(result){
               const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                 "secret", 
                 {
                     expiresIn: "1h"
                 }
                 );
                return res.status(200).json({
                    message: "Auth Successful",
                    token: token
                })
            }
            res.status(401).json({
                message: "Auth Failed"
            });
            
       });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })  
    });
});

router.delete('/:userId',checkAuth, (req,res)=>{
    const id = req.params.userId;

    UserModel.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error :err});
    });
 }); 
 

module.exports = router;