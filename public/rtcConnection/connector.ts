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
			socket.emit("candidate", { candidate: e.candidate, toSocketId: socketId });
		}
	};

	return pc;
};
