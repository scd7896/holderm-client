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

class ConnectionViewModel {
	private playerViewModel: PlayerViewModel;
	private myViewModel: MyViewModel;
	private rtcConnections: RTCPeerConnection[];

	constructor(prop: IProp) {
		this.playerViewModel = prop.playerViewModel;
		this.myViewModel = prop.myViewModel;
		this.rtcConnections = [];

		this.allUserListen();
		this.getOfferListen();
		this.getAnswerListen();
		this.getCandidateListen();
	}

	getCandidateListen() {
		socket.on("getCandidate", ({ candidate, number, fromSocketId }) => {
			const pc = this.rtcConnections[number];
			pc.addIceCandidate(new RTCIceCandidate(candidate));
		});
	}

	getAnswerListen() {
		socket.on("getAnswer", ({ sdp, fromSocketId, number }) => {
			const pc = this.rtcConnections[number];
			pc.setRemoteDescription(new RTCSessionDescription(sdp));
		});
	}

	getOfferListen() {
		socket.on("getOffer", ({ sdp, fromSocketId, number }) => {
			const pc = getConnection();
			this.rtcConnections[number] = pc;
			pc.setRemoteDescription(new RTCSessionDescription(sdp));
			socket.emit("answer", { sdp, toSocketId: fromSocketId, number: this.myViewModel.state.number });
		});
	}

	allUserListen() {
		socket.on("all_users", (data: IJoinInfo) => {
			const ohterUsers = [data.you, ...data.users]
				.map(({ id, money, nickname, number }) => {
					const pc = getConnection();
					pc.createOffer().then((sdp) => {
						pc.setLocalDescription(new RTCSessionDescription(sdp));
						socket.emit("offer", { sdp, toSocketId: id });
					});
					pc.onicecandidate = (e) => {
						if (e.candidate) {
							socket.emit("candidate", { number: data.you.number, candidate: e.candidate });
						}
					};
					this.rtcConnections[number] = pc;
					return {
						id,
						money,
						nickname,
						number,
					};
				})
				.sort((a, b) => a.number - b.number);
			const totalLength = data.users.length + 1;
			const otherPlayers: Player[] = [];
			for (let i = (data.you.number + 1) % totalLength; i !== data.you.number; ) {
				const player = new Player(ohterUsers[i].money);
				otherPlayers.push(player);
				i = (i + 1) % totalLength;
			}

			this.playerViewModel.userSets(otherPlayers);
			this.myViewModel.setState({ number: data.you.number });
		});
	}
}

export default ConnectionViewModel;
