const express = require('express')
const RedeDatabase = require('../../models/RedeModel')


module.exports={

    async getRedeDatabase(req, res){
        try {
            const rededatabase = await RedeDatabase.find()
            console.log(`############## ${ rededatabase } ###########`)
        } catch (error) {
            console.log(error)
        }
    }

}