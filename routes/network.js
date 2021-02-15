const express = require('express');
const router = express.Router();
const createNetwork = require('../app/controller/createNetwork')
const rimraf = require("rimraf");
const path = require('path');
const RedeDatabase = require('../app/database/models/RedeModel')

//Insere os dados na database e Network
router.post('/routeCreateNetwork', async (req, res) => {
    
    console.log(req.body);

    const verify = await createNetwork.verifyNetworkName(req,res);
    if (String(verify) === "exist") {
        res.redirect('/result?msg=existFile');
    } else {
        if (req.body != null) {
//            createNetwork.creatAndSave(req, res);
            const {nomeRede, descricaoRede, nomeOrg, numPeer, nomeCanal} = req.body

            let orgList =[]

            let Org ={
                "nomeOrg":"",
                "numPeer":""
            }

            for(let i =0; i<nomeOrg.length; i++){
                Org={nomeOrg:nomeOrg[i], numPeer:numPeer[i]}
                orgList.push(Org)
            }

            const redeDatabase = new RedeDatabase({
                nomeRede: nomeRede,
                descricaoRede: descricaoRede,
                nomeOrg: nomeOrg,
                numPeer: numPeer,
                nomeCanal: nomeCanal,
                Org: orgList
            })
    
            const newredeDatabase = await redeDatabase.save()
                  
            res.redirect('/result?msg=success');
        } else {
            res.redirect('/result?msg=error');
        }
    }
});

router.get('/routeGetNetwork', async (req, res)=>{
    const rededatabase = await RedeDatabase.find()
    res.send(rededatabase);
});

router.get('/routeGetNetworkById/:id', async (req, res)=>{
    const rededatabase = await RedeDatabase.findById(req.params.id)
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
            res.redirect('/resultDelete?msg=success');     
    });
    
});

module.exports = router;
