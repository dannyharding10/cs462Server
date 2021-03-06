var nodes = {
	'http://localhost:8000/postmessage': {
		user: 'Danny Harding',
		peers: ['http://localhost:8001/postmessage', 'http://localhost:8002/postmessage'],
		seen: {}
	},
	'http://localhost:8001/postmessage': {
		user: 'Ashley Harding',
		peers: ['http://localhost:8000/postmessage', 'http://localhost:8003/postmessage'],
		seen: {}
	},
	'http://localhost:8002/postmessage': {
		user: 'Paisley Grace',
		peers: ['http://localhost:8001/postmessage', 'http://localhost:8000/postmessage', 'http://localhost:8003/postmessage'],
		seen: {}
	},
	'http://localhost:8003/postmessage': {
		user: 'Joe Mama',
		peers: ['http://localhost:8002/postmessage'],
		seen: {}
	}
}

function updateNode(endpoint, id, lastMessage) {
	nodes[endpoint].seen[id] = lastMessage;
}

function getPeer(endpoint) {
	var peers = nodes[endpoint].peers;
	return peers[Math.floor(Math.random() * peers.length)];
}

module.exports = {
	nodes: nodes,
	updateNode: updateNode,
	getPeer: getPeer
}
