const express = require('express');
const router = express.Router();
const createNetwork = require('../app/controller/createNetwork')
const mongodb = require('../app/database/mongodb/Server')
const postRede = require('../app/database/rede/input/postRede')


//Insere os dados na database e Network
router.post('/sendData', async (req, res) => {

    if (req.body != null) {
        createNetwork.creatAndSave(req, res);
        postRede.postRedeDatabase(req, res)


        res.redirect('/result?msg=success');
    } else {
        res.redirect('/result?msg=failed');
    }
});

module.exports = router;
