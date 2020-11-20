const express = require('express')
const RedeDatabase = require('../../models/RedeModel')

module.exports={

    async deleteRedeDatabase(req, res){

        const deleteRede = res.body

        try {
            deleteRede = await res.rededatabase.remove()
            console.log(`Database Rede  ${deleteRede.nomeRede} remove`)
        } catch (error) {
            console.log(error)
        }
    }
}