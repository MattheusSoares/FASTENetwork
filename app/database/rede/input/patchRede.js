const express = require('express')
const RedeDatabase = require('../../models/RedeModel')

module.exports={
    async ModificaRedeDatabase(req, res){

        const {nomeRede, descricaoRede, nomeOrg, numPeer, numOrg, nomeCanal} = req.body

        if(req.body.nomeRede != null){
            res.rededatabase.nomeRede = req.body.nomeRede
        }
        if(req.body.descricaoRede != null){
            res.rededatabase.descricaoRede = req.body.descricaoRede
        }
        if(req.body.nomeOrg != null){
            res.rededatabase.nomeOrg = req.body.nomeOrg
        }
        if(req.body.numOrg != null){
            res.body.numOrg = req.body.numOrg
        }
        if(req.body.numPeer != null){
            res.rededatabase.numPeer = req.body.numPeer
        }
        if(req.body.nomeCanal != null){
            res.rededatabase.nomeCanal = req.body.nomeCanal
        }

        try {
            const updateDatabase = await res.rededatabase.save()
            console.log(`Database ${updateDatabase.nomeRede} Atualizou`)
        } catch (error) {
            console.log(error)
        }
    }
}