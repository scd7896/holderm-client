export const getConnection = () => {
	const pcConfig = {
		iceServers: [
			// {
			//   urls: 'stun:[STUN_IP]:[PORT]',
			//   'credentials': '[YOR CREDENTIALS]',
			//   'username': '[USERNAME]'
			// },
			{
				urls: "stun:stun.l.google.com:19302",
			},
		],
	};

	const pc = new RTCPeerConnection(pcConfig);

	return pc;
};
