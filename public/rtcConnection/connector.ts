import socket from "./socket";

export const getConnection = (number, socketId) => {
	const pcConfig = {
		iceServers: [
			{
				urls: "stun:stun.l.google.com:19302",
				url: "stun:stun.l.google.com:19302",
			},
		],
	};
	let pc = new RTCPeerConnection(pcConfig);

	pc.onicecandidate = (e) => {
		if (e.candidate) {
			console.log("onicecandidate", socketId);
			socket.emit("candidate", { candidate: e.candidate, toSocketId: socketId });
		}
	};

	pc.oniceconnectionstatechange = (e) => {
		console.log(e);
	};

	pc.ondatachannel = (e) => {
		const dataChannel = e.channel;
		console.log("ondataChannel");

		dataChannel.onclose = () => {};
		dataChannel.onmessage = (ev) => {
			const obj = JSON.parse(ev.data);
			console.log("message", obj);
		};
		dataChannel.onopen = () => {};
	};
	return pc;
};
