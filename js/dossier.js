var Dossier = function(){
    var _ = {
        id : '',
        fichiers : []
    };   
    
    this.get = function(variable) 
    { 
        return _[variable];
    };
    
    this.set = function(variable, val) 
    { 
        if(_[variable] !== undefined)
            _[variable] = val; 
    };
};

Dossier.prototype.getDossier = function()
{
    let requete = gapi.client.drive.files.list({
        q : "name = 'Replay' and mimeType = 'application/vnd.google-apps.folder' and sharedWithMe = true"
    });

    requete.execute(this.reponseDossier);
};

Dossier.prototype.reponseDossier = function(reponse){
    if (!reponse.error) {
        let folder = reponse.files[0];
        this.set('id',folder.id);
        this.lireFichiers();
    }else{
        showErrorMessage("Erreur: " + reponse.error.message);
    }
};

Dossier.prototype.lireFichiers = function(){
    let requete = gapi.client.drive.files.list({
        q : "mimeType = 'application/vnd.google-apps.spreadsheet' and '"+ this.get('id') +"' in parents"
    });
    
    requete.execute(this.reponseFichier);
};

Dossier.prototype.reponseDossier = function(reponse){
    if (!reponse.error) {
        for(i=0;i<reponse.files.length;i++){
            let f = reponse.files[i];
            let fichier = new Fichier(fichier.id,fichier.name);
            fichier.get();

            let fs = this.get('fichiers');
            fs.push(fichier);
        } 
    }else{
        showErrorMessage("Erreur: " + reponse.error.message);
    }
};