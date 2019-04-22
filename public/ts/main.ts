import {QueryMethod} from './Look/Use/QueryData';
import Session from './Look/API/Session';
import Request from './Look/API/Request';

var session = new Session('user', 'pass');

session.open(10)
.onError(function(this : Request, data : any) {
    this.repeat(2000); // repeat after 2 sec
})
.onSuccess(function() {
    
    var value1 = 'hello test';
    var value2 = 'hello is 2';
    
    session.get('Tunnel.checkTunnelTokenIn', {data1: value1, data2: value2}, true, QueryMethod.POST)
    .onSuccess(function(data : any) {
        console.log(data);
    }).onError(function(data : any) {
        console.log(data);
    });
    
    session.get('Tunnel.checkTunnelTokenOut')
    .onSuccess((data : string) => {
        console.log(session.token.privateKey.decrypt(data));
    });

    // check token expired
    setTimeout(function() {
        session.get('Tunnel.checkTunnelTokenIn', {data: value1}, true, QueryMethod.POST)
        .onSuccess(function(data : any) {
            console.log(data);
        }).onError(function(data : any) {
            console.log(data);
        });
    }, 11000);
});