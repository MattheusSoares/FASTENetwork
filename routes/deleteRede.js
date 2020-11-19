const express = require('express');
const router = express.Router();
const deleteRede = require('../app/database/rede/input/deleteRede')

//Deleta a Rede database
router.delete('/sendData/:id', async (req, res)=>{
    deleteRede.deleteRedeDatabase(req, res)
})

module.exports = router