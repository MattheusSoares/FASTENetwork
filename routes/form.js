var express = require('express');
var router = express.Router();

router.post('/sendData', (req, res) =>{
    
    
    if (req.body != null) {
        res.redirect('/result?msg=success');
    } else {
        res.redirect('/result?msg=failed');
    }
});

module.exports = router;
