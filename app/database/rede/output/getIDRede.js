const express = require('express');
const router = express.Router();
const RedeDatabase = require('../../models/RedeModel')


//Busca no Mongo por ID

router.get('/:id',  (req, res)=>{
    console.log(redeDatabase)
})