const express = require('express');
const router = express.Router();
const createNetwork = require('../app/controller/createNetwork')
const rimraf = require("rimraf");
const path = require('path');
const RedeDatabase = require('../app/database/models/RedeModel')

//Insere os dados na database e Network
router.post('/routeCreateNetwork', async (req, res) => {
    console.log(req.body)

    /*const verify = await createNetwork.verifyNetworkName(req,res);
    if (String(verify) === "exist") {
        res.redirect('/result?msg=existFile');
    } else {
        if (req.body != null) {
            createNetwork.creatAndSave(req, res);

            const {nomeRede, descricaoRede, nomeOrg, numOrg, numPeer, nomeCanal} = req.body

            const redeDatabase = new RedeDatabase({
                nomeRede: nomeRede,
                descricaoRede: descricaoRede,
                nomeOrg: nomeOrg,
                numOrg: numOrg,
                numPeer: numPeer,
                nomeCanal: nomeCanal
            })
    
            const newredeDatabase = await redeDatabase.save()

            res.redirect('/result?msg=success');
        } else {
            res.redirect('/result?msg=error');
        }
    }*/
});

router.get('/routeGetNetwork', async (req, res)=>{
    const rededatabase = await RedeDatabase.find()
    res.send(rededatabase);
});

router.post('/routeDeleteNetwork', async (req, res)=>{
     
    idRede = req.body.idRede 
    networkName = req.body.nomeRede 

    const networks = path.join(process.cwd(), 'network');
    const pathNetwork = networks + '/' + networkName;

    rimraf(pathNetwork, function () {
        console.log("Network deleted!"); 
   });

    RedeDatabase.findByIdAndDelete(idRede, function (err) {
        if (err) res.redirect('/resultDelete?msg=error');
            //res.redirect('/resultDelete?msg=success');     
    });
    
});

/*
router.post('/routeAlterNetwork', async (req, res)=>{

    const {AltNomeRede, AltDescricaoRede, AltNomeOrg, AltNumOrg, AltNumPeer, AltNomeCanal} = req.body

    if(AltNomeRede != null && AltDescricaoRede != null && AltNomeOrg != null &&
        AltNumOrg != null && AltNumPeer != null && AltNomeCanal != null ){

            const redeDatabase = new RedeDatabase({
                nomeRede: AltNomeRede,
                descricaoRede: AltDescricaoRede,
                nomeOrg: AltNomeOrg,
                numOrg: AltNumOrg,
                numPeer: AltNumPeer,
                nomeCanal: AltNomeCanal
            })
        
            try {
                const updateDatabase = await redeDatabase.save()
                res.redirect('/resultAlter?msg=success');
            } catch (error) {
                console.log(error)
                res.redirect('/resultAlter?msg=error');
                
            }
        
        } else {
            res.redirect('/resultAlter?msg=error');
        }

});
*/

module.exports = router;
