const express = require('express');
const router = express.Router();
const createNetwork = require('../app/controller/createNetwork')
const mongodb = require('../app/database/mongodb/Server')
const postRede = require('../app/database/rede/input/postRede')
const getRede = require('../app/database/rede/output/getRede')


//Insere os dados na database e Network
router.post('/sendData', async (req, res) => {
    const verify = await createNetwork.verifyNetworkName(req,res);
    if (String(verify) === "exist") {
        res.redirect('/result?msg=existFile');
    } else {
        if (req.body != null) {
            createNetwork.creatAndSave(req, res);
            postRede.postRedeDatabase(req, res);

            res.redirect('/result?msg=success');
        } else {
            res.redirect('/result?msg=failed');
        }
    }
});

module.exports = router;
