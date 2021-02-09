var totalOrg = 1;

$(document).on('click','#addOrg',function(){
    totalOrg++;  
    $('#orgList').append('<div class="row" id="rowId'+totalOrg+'">'
    +   '    <div class="col-md-5">'
    +   '       <div class="form-group">'
    +   '           <input type="text" class="form-control" id="nomeOrg" name="nomeOrg[]"'
    +   '       placeholder="Digite o nome da organização" required>'
    +   '       </div>'
    +   '   </div>'
    +   '   <div class="col-md-5">'
    +   '       <div class="form-group">'
    +   '           <input type="number" class="form-control" id="numPeer" name="numPeer[]"'
    +   '           placeholder="Digite o número de nós da organização" required>'
    +   '       </div>'
    +   '   </div>'
    +   '   <div class="col-md-2">'
    +   '       <a id="'+totalOrg+'" onclick="deleteOrgRow(this.id)" class="btn btn-danger" href="#" title="Remover Organização"><i class="ti-close"></i></a>'
    +   '   </div>'
    +   '  </div>');

});

function deleteOrgRow(id){
    var rowId = 'rowId'+id;
    $( "#"+rowId+"").remove();
}