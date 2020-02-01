(function(scope){

	'use strict';

	imprint.registerTest("localIp", function(){
		return new Promise(function(resolve) {
			try 
			{
				var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
				var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
				pc.createDataChannel("");    //create a bogus data channel
				pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
				pc.onicecandidate = function(ice) //listen for candidate events
				{  
					pc.onicecandidate = noop;

					if(!ice || !ice.candidate || !ice.candidate.candidate)  
					{
						return resolve("");
					} 

					var ipv4 = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
					var local = /^ |((?:[0-9A-Za-z]{1,8}))*-((?:[0-9A-Za-z]{1,4}))*-((?:[0-9A-Za-z]{1,4}))*-((?:[0-9A-Za-z]{1,4}))*-((?:[0-9A-Za-z]{1,12}))*.((?:[0-9A-Za-z]{1,5}))| $/;
					var val = ipv4.exec(ice.candidate.candidate) !== null ? ipv4.exec(ice.candidate.candidate)[1] : local.exec(ice.candidate.candidate) !== null ? local.exec(ice.candidate.candidate)[0] : "";
					return resolve(val);			
				};
			} 
			catch (e) 
			{
				return resolve("");
			}
		});
	});

})(window);
