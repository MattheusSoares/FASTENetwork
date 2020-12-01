const mongoose = require('mongoose')
const RedeSchema = new mongoose.Schema({
    nomeRede:{
        type: String,
        required: true
    },
    descricaoRede:{
        type: String,
        required: true
    },
    nomeOrg:{
        type: String,
        required: true
    },
    numOrg:{
        type:String,
        required: true
    },
    numPeer:{
        type: String,
        required: true
    },
    nomeCanal:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RedeDatabase', RedeSchema)