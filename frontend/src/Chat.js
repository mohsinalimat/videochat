import React, {useEffect} from "react";
import Centrifuge from "centrifuge";

import {
    useParams
} from "react-router-dom";

function Chat() {
    let { id } = useParams();

    useEffect(() => {
        console.log("Invoked centrifuge effect");

        // Create Centrifuge object with Websocket endpoint address set in main.go
        var url = ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/api/chat/websocket";
        var clientId;
        var centrifuge = new Centrifuge(url, {
            onRefresh: function(ctx){
                console.debug("Dummy refresh");
            }
        });
        function drawText(text) {
            var div = document.createElement('div');
            div.innerHTML = text + '<br>';
            document.body.appendChild(div);
        }
        centrifuge.on('connect', function(ctx){
            drawText('Connected over ' + ctx.transport);
            console.log("Connected response", ctx);
            clientId = ctx.client;
        });
        centrifuge.on('disconnect', function(ctx){
            drawText('Disconnected: ' + ctx.reason);
        });

        var localStream;
        var pc;
        var remoteStream;
        var turnReady;
        var isStarted = false;
        var isInitiator = false;
        var isChannelReady = false;
        centrifuge.on('message', function(message){
            console.log('Client received direct message:', message);
            if (message.type === 'created') {
                isInitiator = true;
                console.log('Created chan, isInitiator=', isInitiator);
            } else if (message.type === 'joined') {
                console.log('joined: ');
                isChannelReady = true;
            }
        });

        var sub = centrifuge.subscribe("chat", function(message) {
            drawText(JSON.stringify(message));
        });
        var input = document.getElementById("input");
        input.addEventListener('keyup', function(e) {
            if (e.keyCode == 13) { // ENTER key pressed
                sub.publish(this.value);
                input.value = '';
            }
        });
        // After setting event handlers – initiate actual connection with server.
        centrifuge.connect();





        /* https://www.html5rocks.com/en/tutorials/webrtc/basics/
         * WebRTC applications need to do several things:
            Get streaming audio, video or other data.
            Get network information such as IP addresses and ports, and exchange this with other WebRTC clients (known as peers) to enable connection, even through NATs and firewalls.
            Coordinate signaling communication to report errors and initiate or close sessions.
            Exchange information about media and client capability, such as resolution and codecs.
            Communicate streaming audio, video or data.
         */

        var pcConfig = {
            // TODO backend should respond this
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
        };


        var auxSub = centrifuge.subscribe("aux", function(message0) {
            var message = message0.data;
            //console.debug('Client received RAW message from channel:', message0);
            if (message0.info && message0.info.client == clientId) {
                //console.debug('Skipping self-directed RAW message from channel');
                return
            }
            console.log('Client received message from channel:', message);
            if (message === 'got user media') {
                console.log('Reacting on message '+message);
                maybeStart();
            } else if (message.type === 'joined') {
                console.log('joined: ');
                isChannelReady = true;
            } else if (message.type === 'offer') {
                console.log('Reacting on offer as answer');
                if (!isInitiator && !isStarted) {
                    maybeStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            } else if (message.type === 'answer' && isStarted) {
                console.log('Reacting on answer as setRemoteDescription');
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } else if (message.type === 'candidate' && isStarted) {
                console.log('Reacting on candidate as addIceCandidate');
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                pc.addIceCandidate(candidate);
            } else if (message === 'bye' && isStarted) {
                handleRemoteHangup();
            }

        });


        ////////////////////////////////////////////////

        function sendMessage(message) {
            console.log('Client sending message: ', message);
            // socket.emit('message', message);
            auxSub.publish(message);
        }


        ////////////////////////////////////////////////////

        var localVideo = document.querySelector('#localVideo');
        var remoteVideo = document.querySelector('#remoteVideo');

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
            .then(gotStream)
            .catch(function(e) {
                alert('getUserMedia() error: ' + e.name);
            });

        function gotStream(stream) {
            console.log('Adding local stream.');
            localStream = stream;
            localVideo.srcObject = stream;
            sendMessage('got user media'); // here I got my browser's media devices and notify all about this
            if (isInitiator) {
                maybeStart();
            }
        }

        var constraints = {
            video: true
        };

        console.log('Getting user media with constraints', constraints);

        if (location.hostname !== 'localhost') {
            requestTurn(
                'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
            );
        }

        function maybeStart() {
            console.log('>>>>>>> maybeStart() isStarted=' + isStarted + ", localStream="+ localStream + ", isChannelReady="+isChannelReady);
            if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
                console.log('>>>>>> creating peer connection');
                createPeerConnection();
                pc.addStream(localStream);
                isStarted = true;
                console.log("isInitiator="+ isInitiator + ", isStarted="+isStarted);
                if (isInitiator) {
                    doCall();
                }
            } else {
                console.log('>>>>>>> maybeStart() skipping');
            }
        }

        window.onbeforeunload = function() {
            sendMessage('bye');
        };

        /////////////////////////////////////////////////////////

        function createPeerConnection() {
            try {
                pc = new RTCPeerConnection(null);
                pc.onicecandidate = handleIceCandidate;
                pc.onaddstream = handleRemoteStreamAdded;
                pc.onremovestream = handleRemoteStreamRemoved;
                console.log('Created RTCPeerConnnection');
            } catch (e) {
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                alert('Cannot create RTCPeerConnection object.');
                return;
            }
        }

        function handleIceCandidate(event) {
            console.log('handling icecandidate event: ', event);
            if (event.candidate) {
                sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            } else {
                console.log('End of candidates.');
            }
        }

        function handleCreateOfferError(event) {
            console.log('createOffer() error: ', event);
        }

        function doCall() {
            console.log('Sending offer to peer');
            pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
        }

        function doAnswer() {
            console.log('Sending answer to peer.');
            pc.createAnswer().then(
                setLocalAndSendMessage,
                onCreateSessionDescriptionError
            );
        }

        function setLocalAndSendMessage(sessionDescription) {
            pc.setLocalDescription(sessionDescription);
            console.log('sending sessionDescription message');
            sendMessage(sessionDescription);
        }

        function onCreateSessionDescriptionError(error) {
            trace('Failed to create session description: ' + error.toString());
        }

        function requestTurn(turnURL) {
            var turnExists = false;
            for (var i in pcConfig.iceServers) {
                if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
                    turnExists = true;
                    turnReady = true;
                    break;
                }
            }
            if (!turnExists) {
                console.log('Getting TURN server from ', turnURL);
                // No TURN server. Get one from computeengineondemand.appspot.com:
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var turnServer = JSON.parse(xhr.responseText);
                        console.log('Got TURN server: ', turnServer);
                        pcConfig.iceServers.push({
                            'urls': 'turn:' + turnServer.username + '@' + turnServer.turn,
                            'credential': turnServer.password
                        });
                        turnReady = true;
                    }
                };
                xhr.open('GET', turnURL, true);
                xhr.send();
            }
        }

        function handleRemoteStreamAdded(event) {
            remoteStream = event.stream;
            remoteVideo.srcObject = remoteStream;
            console.log('Remote stream added.', remoteStream);
        }

        function handleRemoteStreamRemoved(event) {
            console.log('Remote stream removed. Event: ', event);
        }

        function hangup() {
            console.log('Hanging up.');
            stop();
            sendMessage('bye');
        }

        function handleRemoteHangup() {
            console.log('Session terminated.');
            stop();
            isInitiator = false;
        }

        function stop() {
            isStarted = false;
            pc.close();
            pc = null;
        }

        return function cleanup() {
        };
    });


    return (
        <div>
            <div>Viewing chat # {id}</div>

            <video id="localVideo" autoPlay playsInline></video>
            <video id="remoteVideo" autoPlay playsInline></video>
            <input type="text" id="input" />
        </div>
    )
}

export default Chat;