/**
 * Created by Terasmaa on 16.12.2016.
 */
var https = require('https'),
    pem = require('pem');

pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
    console.log("keys:", keys);
    // https.createServer({key: keys.serviceKey, cert: keys.certificate}, function(req, res){
    //     res.end('o hai!')
    // }).listen(443);
});