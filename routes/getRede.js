const express = require('express');
const router = express.Router();
const getRede = require('../app/database/rede/output/getRede')



router.get('/sendData', async (req, res)=>{
    getRede.getRedeDatabase(req, res)
});

module.exports = router