import { getConnection } from "../../rtcConnection/connector";
import socket from "../../rtcConnection/socket";
import { IJoinInfo } from "../../types";
import Player from "../model/Player";
import MyViewModel from "./My.vm";
import PlayerViewModel from "./Player.vm";

interface IProp {
	playerViewModel: PlayerViewModel;
	myViewModel: MyViewModel;
}
const sendQueue: string[] = [];
class ConnectionViewModel {
	private playerViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private rtcConnections: Record<string, RTCPeerConnection>;
	private dataChannels: Record<string, RTCDataChannel>;

	constructor(prop: IProp) {
		this.playerViewModel = prop.playerViewModel;
		this.myViewModel = prop.myViewModel;
		this.rtcConnections = {};
		this.dataChannels = {};

		this.allUserListen();
		this.userJoinListen();
		this.getOfferListen();
		this.getAnswerListen();
		this.getCandidateListen();
	}

	broadCast(message: string) {
		const keys = Object.keys(this.dataChannels);

		keys.map((key) => {
			const dataChannel = this.dataChannels[key];
			switch (dataChannel.readyState) {
				case "connecting":
					sendQueue.push(message);
					break;
				case "open":
					console.log("opennn", message);
					sendQueue.forEach((message) => dataChannel.send(message));
					dataChannel.send(message);
					break;
				case "closing":
					break;
				case "closed":
					break;
			}
		});
	}

	createDataChannel(pc: RTCPeerConnection, key: string) {
		const dataChannel = pc.createDataChannel(key);

		dataChannel.onmessage = (e) => {
			console.log("messages", e.data);
		};

		dataChannel.onopen = (event) => {
			console.log("open", key);
		};

		// Disable input when closed
		dataChannel.addEventListener("close", (event) => {
			console.log("close");
		});

		this.dataChannels[key] = dataChannel;
	}

	getCandidateListen() {
		socket.on("getCandidate", ({ candidate, fromSocketId, toSocketId }) => {
			console.log(fromSocketId, toSocketId);
			const pc = this.rtcConnections[fromSocketId];
			console.log("candidate", pc);
			if (pc) {
				console.log("candidate 시도하기", pc);
				pc.addIceCandidate(new RTCIceCandidate(candidate)).then((e) => {
					console.log("candidateAddSuccess");
				});
			}
		});
	}

	userJoinListen() {
		socket.on("new_user", ({ id, number, nickname, money }) => {
			const pc = getConnection(number, id);
			this.createDataChannel(pc, id);
			this.rtcConnections[id] = pc;
			this.playerViewModel.joinPlayer(new Player(money), number);
		});
	}

	getAnswerListen() {
		socket.on("getAnswer", async ({ sdp, fromSocketId, number }) => {
			const pc = this.rtcConnections[fromSocketId];
			await pc.setRemoteDescription(new RTCSessionDescription(sdp));
		});
	}

	getOfferListen() {
		socket.on("getOffer", ({ sdp, fromSocketId, number, user }) => {
			const pc = this.rtcConnections[fromSocketId];
			pc.setRemoteDescription(new RTCSessionDescription(sdp));
			pc.createAnswer().then(async (sdp) => {
				await pc.setLocalDescription(new RTCSessionDescription(sdp));
				this.createDataChannel(pc, fromSocketId);
				socket.emit("answer", { sdp, toSocketId: fromSocketId, number: this.myViewModel.state.number });
			});
		});
	}

	allUserListen() {
		socket.on("all_users", (data: IJoinInfo) => {
			const roomUsers = data.users.filter((a) => a !== null);
			const ohterUsers = [data.you, ...roomUsers]
				.map(({ id, money, nickname, number }) => {
					if (data.you.number !== number) {
						const pc = getConnection(data.you.number, id);

						this.createDataChannel(pc, id);
						pc.createOffer().then(async (sdp) => {
							await pc.setLocalDescription(new RTCSessionDescription(sdp));
							socket.emit("offer", { sdp, toSocketId: id, user: data.you, number: data.you.number });
						});

						this.rtcConnections[id] = pc;
					}

					return {
						id,
						money,
						nickname,
						number,
					};
				})
				.sort((a, b) => a.number - b.number);

			const totalLength = ohterUsers.length;
			const otherPlayers: Player[] = [];
			for (let i = (data.you.number + 1) % totalLength; i !== data.you.number; ) {
				if (i !== data.you.number) {
					const player = new Player(ohterUsers[i].money);
					otherPlayers.push(player);
				}
				i = (i + 1) % totalLength;
			}

			this.playerViewModel.userSets(otherPlayers);
			this.myViewModel.setState({ number: data.you.number });
		});
	}
}

export default ConnectionViewModel;
