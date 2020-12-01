window.onload = function start(){
    axios.get('/network/routeGetNetwork')
    .then(function (response) {
        redes = response.data

        conteudo = "";

        for (let i = 0; i < redes.length; i++) {
            conteudo += "<tr>";
                conteudo += "<td>" + redes[i].nomeRede + "</td>";
                conteudo += "<td>" + redes[i].descricaoRede + "</td>";
                conteudo += "<td>" + redes[i].numOrg + "</td>";
                conteudo += "<td>" + redes[i].numPeer + "</td>";
                conteudo += "<td>" + redes[i].nomeCanal + "</td>";
                
                conteudo += "<td>";

                    conteudo += "<form id='deleteRede' method='POST' action='/network/routeDeleteNetwork' enctype='application/json'>";
                    conteudo += "<input type='hidden' name='idRede' id='idRede' value='" + redes[i]._id + "'>";
                    conteudo += "<input type='hidden' name='nomeRede' id='nomeRede' value='" + redes[i].nomeRede + "'>";
                    conteudo += "<input type='button' onClick='submit();' class='btn btn-danger' title='Deletar' value='Deletar Rede'>";
                    conteudo += "</form>";

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