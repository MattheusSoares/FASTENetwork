window.onload = function start(){
    
    document.getElementById('tableRedeInfo').hidden = true
    document.getElementById('divRedeInfo').hidden = true
    document.getElementById('tableListRedes').hidden = false
    
    axios.get('/network/routeGetNetwork')
    .then(function (response) {
        redes = response.data
        console.log(redes)
        conteudo = "";

        for (let i = 0; i < redes.length; i++) {
            conteudo += "<tr>";
                conteudo += "<td>" + redes[i].nomeRede + "</td>";
                conteudo += "<td>" + redes[i].descricaoRede + "</td>";
                conteudo += "<td>" + redes[i].Org.length + "</td>";
                conteudo += "<td>" + redes[i].nomeCanal + "</td>";
                
                conteudo += "<td>";


                    conteudo += "<form id='deleteRede' method='POST' action='/network/routeDeleteNetwork' enctype='application/json'>";
                    conteudo += "<input type='hidden' name='idRede' id='idRede' value='" + redes[i]._id + "'>";
                    conteudo += "<input type='hidden' name='nomeRede' id='nomeRede' value='" + redes[i].nomeRede + "'>";
                    conteudo += "<a class='infoNetwork' title = 'Info Rede' href='javascript:void(0)' data-_idrede='" + redes[i]._id + "'><i class='color-info ti-info-alt' style='font-size: 20px;'></i></a>";
                    conteudo += "<button type='submit'  class='btn btn-link' title='Excluir Rede' > <i class='color-danger ti-trash' style='font-size: 20px;'></i> </button>";
                    conteudo += "</form>";

                    //conteudo += "<a href='/network/routeDeleteNetwork' data-idRede='" + redes[i]._id + "' data-nomeRede='" + redes[i].nomeRede + "'> <i class='color-danger ti-trash'></i> </a>";

                conteudo += "</td>";
            conteudo += "</tr>";

        }

        document.getElementById("listRedes").innerHTML = conteudo;

    })

    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
}

$(document).on('click', '.infoNetwork', function () { 
    var _idNetwork = $(this).data('_idrede')

    
    
    axios.get('/network/routeGetNetworkById/'+_idNetwork)
    .then(function (response) {

        rede = response.data
        
        conteudo = "";

        conteudo += "<tr>";
            conteudo += "<td>" + rede.nomeRede + "</td>";
            conteudo += "<td>" + rede.descricaoRede + "</td>";
            conteudo += "<td>" + rede.Org.length + "</td>";
            conteudo += "<td>" + rede.nomeCanal + "</td>";
            
            conteudo += "<td>";

            conteudo += "<a class='closeInfoNetwork' title='Voltar' href='javascript:void(0)'> <i class='ti-arrow-circle-left' style='font-size: 20px;'></i> </a>";

            conteudo += "</td>";

        conteudo += "</tr>";

        document.getElementById("redeInfo").innerHTML = conteudo;



    })

    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
    

   document.getElementById('tableRedeInfo').hidden = false
   document.getElementById('divRedeInfo').hidden = false
   document.getElementById('tableListRedes').hidden = true
});

$(document).on('click', '.closeInfoNetwork', function () { 
    document.getElementById('tableRedeInfo').hidden = true
    document.getElementById('divRedeInfo').hidden = true
    document.getElementById('tableListRedes').hidden = false

});