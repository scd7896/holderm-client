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
		socket.on("new_user", ({ id, number, nickname, money }) => {
			const pc = getConnection(number, id);
			this.createDataChannel(pc, id);
			this.rtcConnections[id] = pc;
			this.playerViewModel.joinPlayer(new Player({ stackMoney: money, id, isMy: false }), number);
		});
	}

	getAnswerListen() {
		socket.on("getAnswer", async ({ sdp, fromSocketId, number, user }) => {
			const pc = this.rtcConnections[fromSocketId];
			await pc.setRemoteDescription(new RTCSessionDescription(sdp));
			this.playerViewModel.findIdPlayerSet(user.id, new Player({ ...user, isMy: false }));
		});
	}

	getOfferListen() {
		socket.on("getOffer", ({ sdp, fromSocketId, number, user }) => {
			const pc = this.rtcConnections[fromSocketId];
			pc.setRemoteDescription(new RTCSessionDescription(sdp));
			pc.createAnswer().then(async (sdp) => {
				await pc.setLocalDescription(new RTCSessionDescription(sdp));
				this.createDataChannel(pc, fromSocketId);
				socket.emit("answer", {
					sdp,
					toSocketId: fromSocketId,
					number: this.myViewModel.state.number,
					user: this.myViewModel.state.user,
				});
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
					const player = new Player({ stackMoney: ohterUsers[i].money, isMy: false, id: ohterUsers[i].id });
					otherPlayers.push(player);
				}
				i = (i + 1) % totalLength;
			}
			const my = new Player({ isMy: true, id: data.you.id, stackMoney: data.you.money });
			this.playerViewModel.userSets([...otherPlayers, my]);
			this.myViewModel.playerSet(my, data.you.number);
		});
	}
}

export default ConnectionViewModel;
