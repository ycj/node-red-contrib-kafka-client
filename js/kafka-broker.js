module.exports = function(RED) {
    const fs = require('fs');
    const kafka = require('kafka-node');

    function KafkaBrokerNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        node.getOptions = function (){
            var options = new Object();
            options.kafkaHost = config.hosts;

            if(config.usetls){
                options.sslOptions = new Object();

                options.sslOptions.ca = [fs.readFileSync(config.cacert, 'utf-8')];
                options.sslOptions.cert = [fs.readFileSync(config.clientcert, 'utf-8')];
                options.sslOptions.key = [fs.readFileSync(config.privatekey, 'utf-8')];
                options.sslOptions.passphrase = config.passphrase;
                options.sslOptions.rejectUnauthorized = config.selfsign;
            }

            if(config.usepassword){
                options.sasl = new Object();
                options.sasl.mechanism = 'plain';
                options.sasl.username = config.username;
                options.sasl.password = config.password;
            }

            return options;
        }        
    }
    RED.nodes.registerType("kafka-broker",KafkaBrokerNode);
}
