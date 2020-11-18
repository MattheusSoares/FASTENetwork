const express = require('express');
const router = express.Router();

const createNetwork = require('../app/controller/createNetwork');


router.post('/sendData', (req, res) =>{
    
    if (req.body != null) {
        createNetwork.creatAndSave(req, res);


        
        res.redirect('/result?msg=success');
    } else {
        res.redirect('/result?msg=failed');
    }
});

module.exports = router;
