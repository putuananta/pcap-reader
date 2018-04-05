let PORT = 20000;
let MULTICAST_ADDR = "233.255.255.255";
let filePath = '';
let delay = 0;

var pcapp = require('pcap-parser')
var udp = require('udp-packet')
var dgram = require('dgram')
var socket = dgram.createSocket({ type: "udp4", reuseAddr: true})
var argv = require('minimist')(process.argv.slice(2));

socket.bind(PORT)

if(argv.p) {
    PORT = argv.p
} 
if(argv.m) {
    MULTICAST_ADDR = argv.m
}
if(argv.f){
    filePath = argv.f
}

if(argv.d) {
    delay = argv.d
}
var parser = pcapp.parse(filePath)
// var parser = pcapp.parse(process.stdin);

parser.on('packet', function(packet) {
  //console.log(packet.header);
  //console.log(packet.data);
  let buf = udp.decode(packet.data)
  let data = buf.data
  if(data.length > 0) {
        if(data[0] == 0x3e) {
            socket.send(data, 0, data.length, PORT, MULTICAST_ADDR, function() {
                console.log(data);
            });
            const end = Date.now() + delay;
            while (Date.now() < end) {
                const doSomethingHeavyInJavaScript = 1 + 2 + 3;
            }
        }

  }
  //console.log(udp.decode(packet.data))
});

parser.on('end', function() {
    console.log('End of file');
})

parser.on('error', function(error) {
    console.log(error);
})
