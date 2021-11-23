import { getConnection } from "../../rtcConnection/connector";
import socket from "../../rtcConnection/socket";
import { IJoinInfo } from "../../types";
import Player from "../model/Player";
import MessageHandler from "./MessageHandler";
import MyViewModel from "../viewModel/My.vm";
import PlayerViewModel from "../viewModel/Player.vm";

interface IProp {
	playerViewModel: PlayerViewModel;
	myViewModel: MyViewModel;
	messageHandler: MessageHandler;
}
const sendQueue: string[] = [];
class ConnectionViewModel {
	private playerViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private messageHandler: MessageHandler;
	private rtcConnections: Record<string, RTCPeerConnection>;
	private dataChannels: Record<string, RTCDataChannel>;

	constructor(prop: IProp) {
		this.playerViewModel = prop.playerViewModel;
		this.myViewModel = prop.myViewModel;
		this.messageHandler = prop.messageHandler;
		this.rtcConnections = {};
		this.dataChannels = {};

		this.allUserListen();
		this.userJoinListen();
		this.getOfferListen();
		this.getAnswerListen();
		this.getCandidateListen();
		this.userDisconnectListen();
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
					while (sendQueue.length) {
						const message = sendQueue.shift();
						dataChannel.send(message);
					}
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
		pc.ondatachannel = (e) => {
			const dataChannel = e.channel;

			dataChannel.onclose = () => {};

			dataChannel.onmessage = (ev) => {
				const obj = JSON.parse(ev.data);
				this.messageHandler.messageHandle(obj);
			};

			dataChannel.onopen = () => {
				this.playerViewModel.playerConnection(key);
			};
		};

		const dataChannel = pc.createDataChannel(key);

		this.dataChannels[key] = dataChannel;
	}

	userDisconnectListen() {
		socket.on("user_disconnect", (data) => {
			console.log("disconnect", data);
		});
	}

	getCandidateListen() {
		socket.on("getCandidate", ({ candidate, fromSocketId, toSocketId }) => {
			const pc = this.rtcConnections[fromSocketId];
			if (pc) {
				pc.addIceCandidate(new RTCIceCandidate(candidate)).then((e) => {
					console.log("candidateAddSuccess");
				});
			}
		});
	}

	userJoinListen() {
		socket.on("newUser", ({ socketId, payload }) => {
			const pc = getConnection(0, socketId);
			this.createDataChannel(pc, socketId);
			this.rtcConnections[socketId] = pc;
			const index = this.playerViewModel.state.players.findIndex((player) => player.nickname === payload.nickname);
			if (index !== -1) {
				this.playerViewModel.rejoin(payload.nickname);
			} else {
				this.playerViewModel.joinPlayer(
					new Player({
						stackMoney: payload.money || 0,
						id: payload.nickname,
						isMy: false,
						isHost: false,
						nickname: payload.nickname,
						number: index,
					}),
					this.playerViewModel.state.players.length
				);
			}
		});
	}

	getAnswerListen() {
		socket.on("getAnswer", async ({ sdp, fromSocketId, payload }) => {
			const pc = this.rtcConnections[fromSocketId];
			await pc.setRemoteDescription(new RTCSessionDescription(sdp));
			this.playerViewModel.findIdPlayerSet(payload.nickname, new Player({ ...payload, isMy: false }));
		});
	}

	getOfferListen() {
		socket.on("getOffer", async ({ sdp, fromSocketId, payload }) => {
			const pc = this.rtcConnections[fromSocketId];
			await pc.setRemoteDescription(new RTCSessionDescription(sdp));
			this.playerViewModel.findIdPlayerSet(payload.nickname, new Player({ ...payload, isMy: false }));
			pc.createAnswer().then(async (sdp) => {
				await pc.setLocalDescription(new RTCSessionDescription(sdp));
				this.createDataChannel(pc, fromSocketId);
				socket.emit("answer", {
					sdp,
					toSocketId: fromSocketId,
					payload: this.myViewModel.state.user,
				});
			});
		});
	}

	allUserListen() {
		socket.on("getAllUser", (data: IJoinInfo) => {
			const myNumber = data.users.findIndex((user) => user.socketId === data.you.socketId);
			const my = new Player({
				isMy: true,
				id: data.you.socketId,
				stackMoney: 8000,
				isHost: false,
				nickname: data.you.nickname,
				number: myNumber,
			});

			const allUsers = data.users.map(({ socketId, nickname, join }) => {
				if (data.you.socketId !== socketId && join) {
					const pc = getConnection(data.you.socketId, socketId);
					this.createDataChannel(pc, socketId);
					this.rtcConnections[socketId] = pc;
					pc.createOffer({
						iceRestart: true,
					}).then(async (sdp) => {
						await pc.setLocalDescription(new RTCSessionDescription(sdp));
						socket.emit("offer", { sdp, toSocketId: socketId, payload: my });
					});
				}
				return {
					socketId,
					nickname,
				};
			});

			const totalLength = allUsers.length;

			const otherPlayers: Player[] = [];
			for (let i = (myNumber + 1) % totalLength; i !== myNumber; ) {
				if (i !== myNumber) {
					const player = new Player({
						stackMoney: 0,
						isMy: false,
						id: allUsers[i].socketId,
						isHost: false,
						nickname: allUsers[i].nickname,
						number: i,
					});
					otherPlayers.push(player);
				}
				i = (i + 1) % totalLength;
			}

			const isMeHost = !otherPlayers.reduce((acc, player) => player.isHost || acc, false);
			if (otherPlayers.length === 0 || isMeHost) {
				this.myViewModel.hostSet(true);
			}

			const joinMembers = otherPlayers.filter((player) => player.isJoin);
			my.isHost = joinMembers.length === 0;
			this.playerViewModel.userSets(otherPlayers);
			this.myViewModel.playerSet(my, myNumber);
		});
	}
}

export default ConnectionViewModel;
