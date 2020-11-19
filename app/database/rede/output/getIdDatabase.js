const express = require('express')
const router = express.Router()
const RedeDatabase = require('../../models/RedeModel')


module.exports={
async  getDatabaseID(req, res, id){
    try {
        redeDatabase = await RedeDatabase.findById(id)
        if(redeDatabase == null){
            console.log('Network not found!')
        }
    } catch (error) {
       console.log(error.message)
    }
    return redeDatabase


}}

