# Teltonika Parser Extended #

Parsing teltonika binary data from device FMB0XX. This project is forked from teltonika-parser where it lacks the support for codec-8 extended protocol
Right now this project supports **Codec8, Codec8 extended and Codec7 format**.

### Installation ###

Run console command

`npm i teltonika-parser-extended`


### Usage example ###
```
 const net = require('net');
 const Parser = require('teltonika-parser-extended');
 const binutils = require('binutils64');
 
 
 let server = net.createServer((c) => {
 
     console.log("client connected");
     c.on('end', () => {
         console.log("client disconnected");
     });
 
     c.on('data', (data) => {
 
         let buffer = data;
         let parser = new Parser(buffer);
         if(parser.isImei){
             c.write(Buffer.alloc(1, 1));
         }else {
             let avl = parser.getAvl();
              
             let writer = new binutils.BinaryWriter();
             writer.WriteInt32(avl.number_of_data);
 
             let response = writer.ByteBuffer;             
             c.write(response);
         }
     });
 });
 
 server.listen(5000, () => {
     console.log("Server started");
 });
 ```

 *For more insight into the teltonika payload from FMB00X, check with teltonika official wiki page*
