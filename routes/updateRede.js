const express = require('express');
const router = express.Router();
const patchRede = require('../app/database/rede/input/patchRede')


//Modifica a Database
router.patch('/:id', async (req, res)=>{
    patchRede.ModificaRedeDatabase(req, res)
})

module.exports = router;