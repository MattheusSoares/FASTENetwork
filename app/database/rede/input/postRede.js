const express = require('express')
const RedeDatabase = require('../../models/RedeModel')


module.exports = {
    async postRedeDatabase(req, res){
        const {nomeRede, descricaoRede, nomeOrg, numPeer, numOrg, nomeCanal} = req.body

        const redeDatabase = new RedeDatabase({
            nomeRede: req.body.nomeRede,
            descricaoRede: req.body.descricaoRede,
            nomeOrg: req.body.nomeOrg,
            numOrg: req.body.numOrg,
            numPeer: req.body.numPeer,
            nomeCanal: req.body.nomeCanal
        })

        try {
            const newredeDatabase = await redeDatabase.save()
            console.log("#########"+newredeDatabase.nomeRede+""+"saved to Rede collection"+"#############")
        } catch (error) {
            console.log(error)
        }

    }

}