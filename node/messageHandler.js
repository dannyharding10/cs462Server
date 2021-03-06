var uuid = require('./constants').uuid;
var nodeManager = require('./nodeManager');
var constants = require('./constants');
var workQueue = require('./workQueue');

var allMessages = [];
var hashMessages = {};
var messageNumber = 0;

function storeRumor(message) {
	if (!isRumor(message)) {
		return;
	}

	storeMessage({
		id: message.Rumor.MessageID,
		user: message.Rumor.Originator,
		text: message.Rumor.Text
	}, message.EndPoint);
}

function storeMessage(message, endpoint) {
	var messageData = message.id.split(':');

	if (endpoint) {
		nodeManager.updateNode(endpoint, messageData[0], messageData[1]);
	}

	if (hashMessages.hasOwnProperty(message.id)) {
		// already stored
		return;
	}
	
	allMessages.push(message);
	hashMessages[message.id] = message;
	nodeManager.updateNode(constants.endpoint, messageData[0], messageData[1]);
}

function isRumor(message) {
	return message.hasOwnProperty('Rumor');
}

function isWant(message) {
	return message.hasOwnProperty('Want');
}

function isFromSelf(message) {
	return message.userID === uuid;
}

function fillOutMessage(message) {
	var messageID = uuid + ':' + messageNumber++;

	message.id = messageID;
	message.user = nodeManager.nodes[constants.endpoint].user;
	delete message.userID;
}

function handleMessage(message) {
	if (isFromSelf(message)) {
		fillOutMessage(message);
		storeMessage(message);
	}
	else if (isRumor(message)) {
		storeRumor(message);
	} else if (isWant(message)) {
		for(var id in message.Want) {
			nodeManager.updateNode(message.EndPoint, id, message.Want[id]);
		}
		
		workQueue.addToQueue(message);
		workQueue.processQueue();
	}
}

function getMessageToSend(iKnowMore) {
	var randomIndex = Math.floor(Math.random() * Object.keys(iKnowMore).length);
	var userID = Object.keys(iKnowMore)[randomIndex];
	var messageID = userID + ':' + iKnowMore[userID];

	return hashMessages[messageID];
}
 //    Rumor Format
 //    {"Rumor" : {"MessageID": "ABCD-1234-ABCD-1234-ABCD-1234:5" ,
 //                "Originator": "Phil",
 //                "Text": "Hello World!"
 //                },
 //     "EndPoint": "https://example.com/gossip/13244"
 //    }

module.exports = {
	messages: allMessages,
	handle: handleMessage,
	getMessageToSend: getMessageToSend
}