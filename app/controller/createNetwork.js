const fs = require('fs');
const fsex = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const readline = require('readline');
const crypto = require('crypto');

module.exports = {
   async creatAndSave(req,res) {
      const {nomeRede, descricaoRede, nomeOrg, numPeer, numOrg, nomeCanal} = req.body;

      const networkName = nomeRede.split(" ").join("_");
      
      let portNumber = 7051;
      let portNumber2 = 7051;
      let portPeer2  = 7080;
      let portOrderer = 7050;
      let couchdbNumber = 0;
      let portCouch = 5984;
      let portCA = 9054;
      let ordererPeer = [];
      let ordererCA = [];
      let portnumberConfig = 7051;
      let peerOrganizations = [];
      let portcaNetworkConfig = 9054;

      const networks = path.join(process.cwd(), 'network');
      const pathNetworks = networks + '/' + networkName;
      const bin = networks + '/bin/';

      // Define os arquivos da pasta template
      const templateBase = path.join(process.cwd(), '/template/base');
      const templateNetworkConfig = path.join(process.cwd(), '/template/networkconfig');
      const templateCrypto = path.join(process.cwd(), '/template/crypto');
      const templateConfigTx = path.join(process.cwd(), '/template/configtx');
      // Define os arquivos da pasta base
      const baseFile = path.resolve(__dirname, templateBase, 'base.yaml');
      const dockerComposeFile = path.resolve(__dirname, templateBase, 'docker-compose.yaml');
      const dockerComposeCAFile = path.resolve(__dirname, templateBase, 'docker-compose-ca.yaml');
      const dockerComposeCLIFile = path.resolve(__dirname, templateBase, 'docker-compose-cli.yaml');
      const dockerComposeCouchDBFile = path.resolve(__dirname, templateBase, 'docker-compose-couchdb.yaml');
      const dockerComposeOrdererFile = path.resolve(__dirname, templateBase, 'docker-compose-orderer.yaml');
      const dockerComposePeerFile = path.resolve(__dirname, templateBase, 'docker-compose-peer.yaml');
      // Define os arquivos da pasta configtx
      const configtxFile = path.resolve(__dirname, templateConfigTx, 'configtx.yaml');

      const configtxOrganizations = path.resolve(__dirname, templateConfigTx, 'organizations.yaml');
      const configtxOrganizationOrgs = path.resolve(__dirname, templateConfigTx, 'organizations-orgs.yaml');
      const configtxCapabilities = path.resolve(__dirname, templateConfigTx, 'capabilities.yaml');
      const configtxApplication = path.resolve(__dirname, templateConfigTx, 'application.yaml');
      const configtxOrderer = path.resolve(__dirname, templateConfigTx, 'orderer.yaml');
      const configtxChannel = path.resolve(__dirname, templateConfigTx, 'channel.yaml');

      const configtxProfileChannel = path.resolve(__dirname, templateConfigTx, 'profile-channel.yaml');
      const configtxProfileChannelOrgNameLine = path.resolve(__dirname, templateConfigTx, 'profile-channel-orgNameLine.yaml');
      const configtxProfileSampleOrgs = path.resolve(__dirname, templateConfigTx, 'profile-sampleOrgs.yaml');
      const configtxProfileOrganizations = path.resolve(__dirname, templateConfigTx, 'profile-organizations.yaml');
      const configtxProfileOrganizationsOrgNameLine = path.resolve(__dirname, templateConfigTx, 'profile-organizations-orgNameLine.yaml');
      
      // Define os arquivos da pasta crypto
      const cryptogenFile = path.resolve(__dirname, templateCrypto, 'cryptogen.yaml');
      const peerCryptogenFile = path.resolve(__dirname, templateCrypto, 'peer-cryptogen.yaml');
      // Define os arquivos da pasta networkconfig
      const networkConfigFile = path.resolve(__dirname, templateNetworkConfig, 'network-config.yaml');
      const channelFile = path.resolve(__dirname, templateNetworkConfig, 'channel.yaml');
      const peerChannelFile = path.resolve(__dirname, templateNetworkConfig, 'peerchannel.yaml');
      const chaincodeFile = path.resolve(__dirname, templateNetworkConfig, 'chaincode.yaml');
      const organizationOrgMSPFile = path.resolve(__dirname, templateNetworkConfig, 'organizationsOrgMSP.yaml');
      const organizationCAFile = path.resolve(__dirname, templateNetworkConfig, 'organizationsCA.yaml');
      const ordererFile = path.resolve(__dirname, templateNetworkConfig, 'orderer.yaml');
      const peerFile = path.resolve(__dirname, templateNetworkConfig, 'peer.yaml');
      const certificateAuthoritiesFile = path.resolve(__dirname, templateNetworkConfig, 'certificateAuthorities.yaml');
      const caFile = path.resolve(__dirname, templateNetworkConfig, 'ca.yaml');
      const orgFile = path.resolve(__dirname, templateNetworkConfig, 'org.yaml');
      //Leitura de um arquivo
      const readFile = (file) => {
         return new Promise( (resolve, reject) => {
         fs.readFile(file, (err, data) => {
            if (err) {
               return reject(err);
            } else {
               return resolve(data); 
            }
         } );
         //processLineByLine(file);
         } );
      };
      //Leitura linha por linha
      // async function processLineByLine(file) {
      //    const fileStream = fs.createReadStream(file);
      
      //    const rl = readline.createInterface({
      //    input: fileStream,
      //    crlfDelay: Infinity
      //    } );
      //    for await (const line of rl) {
      //    // Each line in input.txt will be successively available here as `line`.
      //    console.log(`${line}`);
      //    };
      // };
      //Leitura do diretorio
      const readDirectory = (path) => {
         return new Promise ( (resolve, reject) => {
         fs.readdir(path, function(err, items) {
            if (err)
               reject(err);
            else {
               for (var i=0; i<items.length; i++) {
                  var file =  items[i];
                  if(file.includes("sk")){
                      resolve(file);
                  }         
              }
            }
         } );
         } );
      };
      //Escreve no arquivo
      const writeFile = (file, contents) => {
         return new Promise ( (resolve, reject) => {
         fs.writeFile(file, contents, (err) => {
            if (err)
               return reject('Erro ao escrever o arquivo (' + err + ')');
            resolve('Seccess');
         } )
         } )
      }
      //Adiciona no arquivo
      const appendFile = ( file, contents ) => {
         return new Promise ( (resolve, reject) => {
         fs.appendFile( file, contents, (err) => {
            if (err)
               return reject('Erro ao anexar ao arquivo (' + ')' );
            resolve('Seccess');
         } )
         } )
      }
      //Altera uma informação no arquivo dado uma opção
      const replaceFile = (contents, stringReplace, value) => {
         return new Promise( (resolve, reject) => {
         switch(stringReplace) {
            case 'Channelname':
               var newValue = String(contents).replace(/Channelname/g, value);
               resolve(newValue);
               break;
            case 'couchdbname':
               var newValue = String(contents).replace(/couchdbname/g, 'couchdb' + value);
               resolve(newValue);
               break;
            case 'couchdbpassword':
               var newValue = String(contents).replace(/COUCHDB_PASSWORD=/g, 'COUCHDB_PASSWORD=' + value);
               resolve(newValue);
               break;
            case 'couchdbpassword':
               var newValue = String(contents).replace(/COUCHDB_PASSWORD=/g, 'COUCHDB_PASSWORD=' + value);
               resolve(newValue);
               break;
            case 'couchdbuser':
               var newValue = String(contents).replace(/COUCHDB_USER=/g, 'COUCHDB_USER=' + value);
               resolve(newValue);
               break;
            case 'countpeer': //ok
               var newValue = String(contents).replace(/countpeer/g, value);
               resolve(newValue);
               break;
            case 'description':
               var newValue = String(contents).replace(/description/g, value);
               resolve(newValue);
               break;
            case 'keyorg':
               var newValue = String(contents).replace(/keyorg/g, value);
               resolve(newValue);
               break;
            case 'networkname':
               var newValue = String(contents).replace(/networkname/g, value);
               resolve(newValue);
               break;     
            case 'ordererca':
               var newValue = String(contents).replace(/ordererca/g, value);
               resolve(newValue);
               break;      
            case 'ordererpeer':
               var newValue = String(contents).replace(/ordererpeer/g, value);
               resolve(newValue);
               break;
            case 'OrganizationsOrgs':
               var newValue = String(contents).replace(/OrganizationsOrgs/g, value);
               resolve(newValue);
               break;
            case 'orgname'://ok
               var newValue = String(contents).replace(/orgname/g, value);
               resolve(newValue);
               break;
            case 'peernumber':
               var newValue = String(contents).replace(/peernumber/g, 'peer' + value);
               resolve(newValue);
               break;
            case 'peersOrgs':
               var newValue = String(contents).replace(/peersOrgs/g, value);
               resolve(newValue);
               break;
            case 'portca':
               var newValue = String(contents).replace(/portca/g, value);
               resolve(newValue);
               break;
            case 'portcouch':
               var newValue = String(contents).replace(/portcouch/g, value);
               resolve(newValue);
               break;
            case 'portnumber':
               var newValue = String(contents).replace(/portnumber/g, value);
               resolve(newValue);
               break;
            case 'portorderer':
               var newValue = String(contents).replace(/portorderer/g, value);
               resolve(newValue);
               break;
            case 'orderer':
               var newValue = String(contents).replace(/orderer/g, value);
               resolve(newValue);
               break;
            case 'portpeer':
               var newValue = String(contents).replace(/portpeer/g, value);
               resolve(newValue);
               break;
            case 'portpeer2':
               var newValue = String(contents).replace(/portpeer2/g, value);
               resolve(newValue);
               break;     
            case 'wallet-name':
               var newValue = String(contents).replace(/wallet-name/g, value);
               resolve(newValue);
               break;
            default:
               console.log('Não encontou a opção');
         }
         } )
      };
      //Cria as pastas e arquivos da network
      async function generateFiles(){
         await fs.mkdirSync(pathNetworks+"/crypto-config"); 
      
         await fs.mkdirSync(pathNetworks+"/channel-artifacts");  

         //await fsex.ensureDir(pathNetworks+"/src/github.com/chaincode");
         
         await fs.copyFileSync(baseFile, pathNetworks+"/base.yaml");
         await fs.copyFileSync(dockerComposeFile, pathNetworks+"/docker-compose.yaml");
         await fs.copyFileSync(configtxFile, pathNetworks+"/configtx.yaml");
         await fs.copyFileSync(cryptogenFile, pathNetworks+"/crypto-config.yaml");
         await fs.copyFileSync(networkConfigFile, pathNetworks+"/network-config.yaml");
      
      };
      //Altera os dados(REGEX) de um arquivo
      async function changeWriteFile(file, option, value){
         // Efetua a alteração nos arquivos
         const fileReader = await readFile(file); // Efetua a leitura do arquivo
         const fileReplace = await Promise.resolve (replaceFile(String(fileReader), option, String(value).toLocaleLowerCase())); // Efetua a troca do escrito
         await Promise.resolve(writeFile(file, fileReplace)); // Escreve no arquivo com os dados alterados
      }
      //Adiciona os dados em um arquivo
      async function changeAppendFile(fileOrigin, fileDestiny, option, value){
         const fileReader = await readFile(fileOrigin);
         const fileReplace = await Promise.resolve (replaceFile(String(fileReader), option, value));
         await Promise.resolve(appendFile(fileDestiny, fileReplace));
      }
      //Cria o arquivo base.yaml de uma network
      async function createBaseFile(){
         const base = path.join(pathNetworks, '/base.yaml');
         await changeWriteFile(base, 'networkname', networkName);    
      }
      //Cria o arquivo docker-compose.yaml de uma network
      async function createDockerComposeFile(){
         const dockerCompose = path.join(pathNetworks, '/docker-compose.yaml');
    
         await changeWriteFile(dockerCompose, 'networkname', networkName);

         let orgName = String(nomeOrg).split(' ');
         
         for (let i = 0; i < orgName.length; i++) {
            const peer = numPeer;

            for (let j = 0; j < peer; j++) {
               await changeAppendFile(dockerComposePeerFile, dockerCompose, 'orgname', orgName[i]);
               await changeWriteFile(dockerCompose, 'peernumber', j);
               await changeWriteFile(dockerCompose, 'couchdbname', couchdbNumber);
               await changeWriteFile(dockerCompose, 'portcouch', portCouch);
               await changeWriteFile(dockerCompose, 'portpeer2', portPeer2);
               await changeWriteFile(dockerCompose, 'networkname', networkName);
               await changeWriteFile(dockerCompose, 'portnumber', portNumber);

               await changeAppendFile(dockerComposeCouchDBFile, dockerCompose, 'couchdbname', couchdbNumber);
               await changeWriteFile(dockerCompose, 'couchdbname', couchdbNumber);
               await changeWriteFile(dockerCompose, 'portcouch', portCouch);
               await changeWriteFile(dockerCompose, 'networkname', networkName);

               portNumber = portNumber+1000;
               portPeer2++;
               couchdbNumber++;
               portCouch++;
            }

            portCA++;
            let keyOrg = crypto.randomBytes(6).toString('hex');
            await changeAppendFile(dockerComposeCAFile, dockerCompose, 'orgname', orgName[i]);
            await changeWriteFile(dockerCompose, 'keyorg', 'keyorg');
            await changeWriteFile(dockerCompose, 'portca', portCA);
            await changeWriteFile(dockerCompose, 'networkname', networkName);

         } 

         await changeAppendFile(dockerComposeOrdererFile, dockerCompose, 'networkname', networkName);
         await changeWriteFile(dockerCompose, 'portorderer', portOrderer);
         await changeWriteFile(dockerCompose, 'ordererpeer', ordererPeer);
      }
      //Cria o arquivo crypto-config.yaml de uma network
      async function createCryptoConfig(){
         const cryptogen = path.join(pathNetworks, '/crypto-config.yaml');

         let orgName = String(nomeOrg).split(' ');

         for (let i = 0; i<orgName.length; i++) {
            for (let j = 0; j < numPeer.length; j++ ) {
               await changeAppendFile(peerCryptogenFile, cryptogen, 'orgname', orgName[i]);
               await changeWriteFile(cryptogen, 'countpeer', numPeer[j]);
            } 
         }
      }
      //Cria o arquivo configtx.yaml de uma network
      async function createConfigtx(){
         const configtx = path.join(pathNetworks, '/configtx.yaml');
         await changeAppendFile(configtxOrganizations, configtx, 'orgname', '');
         let orgName = String(nomeOrg).split(' ');
         for (let i = 0; i < orgName.length; i++) {      
            await changeAppendFile(configtxOrganizationOrgs, configtx, 'orgname', orgName[i]);
         }
         await changeAppendFile(configtxCapabilities, configtx, 'OrganizationsOrgs', numOrg);
         await changeAppendFile(configtxApplication, configtx, 'portorderer', portOrderer);
         await changeAppendFile(configtxOrderer, configtx, 'OrganizationsOrgs', orgName[0]);
         await changeAppendFile(configtxChannel, configtx, 'Channelname', nomeCanal);

         await changeAppendFile(configtxProfileChannel, configtx, 'Channelname', nomeCanal);
         for (let i = 0; i < orgName.length; i++) {      
            await changeAppendFile(configtxProfileChannelOrgNameLine, configtx, 'orgname', orgName[i]);
         }
         await changeAppendFile(configtxProfileSampleOrgs, configtx, 'Channelname', nomeCanal);
         await changeAppendFile(configtxProfileOrganizations, configtx, 'Channelname', nomeCanal);
         for (let i = 0; i < orgName.length; i++) {      
            await changeAppendFile(configtxProfileOrganizationsOrgNameLine, configtx, 'orgname', orgName[i]);
         } 
      }
      //Cria o arquivo network-config.yaml de uma network
      async function creatNetworkConfig(){
         const networkconfig = path.join(pathNetworks, '/network-config.yaml')

         await changeWriteFile(networkconfig, 'description', descricaoRede);
         await changeWriteFile(networkconfig, 'networkname', networkName);

         await changeAppendFile(channelFile, networkconfig, 'Channelname', nomeCanal);

         let orgName = String(nomeOrg).split(' ');

         for (let i = 0; i<orgName.length; i++) {
            await changeAppendFile(peerChannelFile, networkconfig, 'orgname', orgName[i]);
         }

         await changeWriteFile(networkconfig, 'peernumber', numPeer);

         await changeAppendFile(chaincodeFile, networkconfig, 'orgname', '');

         for (let i = 0; i<orgName.length; i++) {
            let keyOrg = crypto.randomBytes(6).toString('hex');
            await changeAppendFile(organizationOrgMSPFile, networkconfig, 'orgname', orgName);
            await changeWriteFile(networkconfig, 'peersOrgs', numPeer);
            await changeAppendFile(organizationCAFile, networkconfig, 'orgname', orgName);
            await changeWriteFile(networkconfig, 'keyorg', 'keyorg');
         }


         for (let i = 0; i<orgName.length; i++) {
            await changeAppendFile(peerFile, networkconfig, 'portpeer', portPeer2++);
            await changeWriteFile(networkconfig, 'orgname', orgName[i]);
            await changeWriteFile(networkconfig, 'peernumber', numPeer);
         }

         await changeAppendFile(certificateAuthoritiesFile, networkconfig, 'orgname', '');
         for (let i = 0; i<orgName.length; i++) {
            await changeAppendFile(caFile, networkconfig, 'portca', portcaNetworkConfig);
            await changeWriteFile(networkconfig, 'orgname', orgName[i]);
         }
         
         for (let i = 0; i<orgName.length; i++) {
            await changeAppendFile(orgFile, networkconfig, 'networkname', networkName);
            await changeWriteFile(networkconfig, 'orgname', orgName[i]);
            await changeWriteFile(networkconfig, 'description', descricaoRede);
         }

      }
      //Adiciona as chaves das organizações nos arquivos .yaml
      async function creatKeys(){
         const dockerCompose = path.join(pathNetworks, '/docker-compose.yaml');
         const networkconfig = path.join(pathNetworks, '/network-config.yaml')
         let orgName = String(nomeOrg).split(' ');
         for (let i = 0; i<orgName.length; i++) {
            const value = await Promise.resolve(readDirectory(pathNetworks+'/crypto-config/peerOrganizations/'+orgName[i]+'.com/ca/'));
            await changeWriteFile(dockerCompose, 'keyorg', value);
            await changeWriteFile(networkconfig, 'keyorg', value);
         }
         
      }

      async function createCertificates(){
         //Comandos para gerar os certificados da rede e de cada organização
         shell.exec(bin +'cryptogen generate --config='+pathNetworks+'/crypto-config.yaml --output='+pathNetworks+'/crypto-config');

         shell.cd(pathNetworks);

         shell.exec( bin + 'configtxgen -profile SampleOrgs -outputBlock ./channel-artifacts/genesis.block -channelID ' + nomeCanal );

         shell.exec( bin + 'configtxgen -profile ' + nomeCanal + ' -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID ' + nomeCanal  );

         let orgName = String(nomeOrg).split(' ');

         for (let i = 0; i<orgName.length; i++) {
            shell.exec( bin + 'configtxgen -profile ' + nomeCanal + ' -outputAnchorPeersUpdate ./channel-artifacts/' + orgName[i] + 'MSPanchors.tx -channelID ' + nomeCanal + ' -asOrg ' + orgName[i] + 'MSP' );
         }

         shell.cd('../..');
      }

      async function make(){
         await generateFiles();

         await createBaseFile();
         await createCryptoConfig();
         await createDockerComposeFile();
         await createConfigtx();
         await creatNetworkConfig();

         //FALTA CRIAR O CHAINCODE

         await createCertificates();
                  
         await creatKeys();

      }
      
      await fs.stat(pathNetworks, async function(err, stats){
         if(err) {
   
           if(fs.existsSync(networks)) {
             fs.mkdirSync(pathNetworks.trim());
           } else {
             fs.mkdirSync(networks.trim());
             fs.mkdirSync(networks + '/bin');
             fs.mkdirSync(pathNetworks.trim());
           }
   
           await make();

           
         }
         else{
           console.log('Essa networks já existe');

         }
       })
       
   },

   verifyNetworkName(req,res){
         const networks = path.join(process.cwd(), 'network');
         const pathNetworks = networks + '/' + req.body.nomeRede;
         if (fs.existsSync(pathNetworks)) {
            return "exist";
         }
         return "notExist";
   }

}
