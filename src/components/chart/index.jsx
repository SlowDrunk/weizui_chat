import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Image, Modal, Button, Spin } from "antd";
import { CameraOutlined, SendOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { base64ToFile } from "../../utils/base64ToFile.js";

const Chat = () => {
	const [chat, setChat] = useState();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [isRecoginition, setIsRecoginition] = useState(false);
	const [isModalOpen, setIsModelOpen] = useState(false);
	// 语音识别实例对象
	let recognition =
		new window.webkitSpeechRecognition() || new window.SpeechRecognition();

	const { t } = useTranslation();
	const [imgPreviewList, setImgPreviewList] = useState([]);
	const [img, setImg] = useState({
		file: null,
		url: "",
	});
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const { currentUser } = useUserStore();
	const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
		useChatStore();
	const endRef = useRef(null);

	useEffect(() => {
		recognition.continuous = true;
		recognition.lang = "zh-CN";
	}, []);

	useEffect(() => {
		const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
			setChat(res.data());
			setImgPreviewList(
				res
					.data()
					.messages.filter((item) => item.img)
					.map((ele) => ele.img)
			);
		});
		return () => {
			unSub();
		};
	}, [chatId]);

	recognition.onresult = (e) => {
		setText((pre) => pre + e.results[0][0].transcript);
	};

	const handleEmoji = (e) => {
		setText((prev) => prev + e.emoji);
		setOpen(false);
	};

	const handleSend = async (messageType, file) => {
		let imgUrl = null;
		try {
			if (messageType === "picture") {
				// 发送图片
				imgUrl = await upload(file);
				await updateDoc(doc(db, "chats", chatId), {
					messages: arrayUnion({
						senderId: currentUser.id,
						createdAt: Date.now(),
						img: imgUrl,
					}),
				});
			} else {
				// 发送文字
				await updateDoc(doc(db, "chats", chatId), {
					messages: arrayUnion({
						senderId: currentUser.id,
						text,
						createdAt: Date.now(),
					}),
				});
			}
			const userIDs = [currentUser.id, user.id];

			userIDs.forEach(async (id) => {
				const userChatsRef = doc(db, "userchats", id);
				const userChatsSnapshot = await getDoc(userChatsRef);

				if (userChatsSnapshot.exists()) {
					const userChatsData = userChatsSnapshot.data();

					const chatIndex = userChatsData.chats.findIndex(
						(c) => c.chatId === chatId
					);

					userChatsData.chats[chatIndex].lastMessage = text
						? text
						: "[图片]";
					userChatsData.chats[chatIndex].isSeen =
						id === currentUser.id ? true : false;
					userChatsData.chats[chatIndex].updatedAt = Date.now();

					await updateDoc(userChatsRef, {
						chats: userChatsData.chats,
					});
				}
			});
		} catch (err) {
			console.log(err);
		} finally {
			setImg({
				file: null,
				url: "",
			});
			setText("");
		}
	};

	const handleImg = (e) => {
		setImg({
			file: e.target.files[0],
			url: URL.createObjectURL(e.target.files[0]),
		});
		handleSend("picture", e.target.files[0]);
	};

	const handleCamera = () => {
		setIsModelOpen(true);
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((steam) => {
				if (videoRef.current) {
					videoRef.current.srcObject = steam;
				}
			})
			.catch((err) => {
				toast.error(err);
			});
	};
	// 绘制摄像头的最后一帧到屏幕
	const DrawPicture = () => {
		if (canvasRef.current) {
			const content = canvasRef.current.getContext("2d");
			content.drawImage(
				videoRef.current,
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height
			);
			const imageData = canvasRef.current.toDataURL("image/png");
			setImg({
				file: base64ToFile(imageData),
				url: URL.createObjectURL(base64ToFile(imageData)),
			});
		}
	};
	// 关闭当前标签的所有媒体流
	const closeCamera = () => {
		if (videoRef.current.srcObject) {
			const tracks = videoRef.current.srcObject.getTracks();
			tracks.forEach((track) => track.stop());
		}
	};
	// 点击确认
	const handleOk = () => {
		closeCamera();
		handleSend("picture", img.file);
		setIsModelOpen(false);
		setImg({
			file: null,
			url: "",
		});
	};
	// 取消
	const handleCancel = () => {
		closeCamera();
		setIsModelOpen(false);
		setImg({
			file: null,
			url: "",
		});
	};

	return (
		<>
			{user ? (
				<div className="chat">
					<div className="top">
						<div className="user">
							<img src={user?.avatar || "./avatar.png"} alt="" />
							<div className="texts">
								<span>{user?.username}</span>
								<p
									style={{
										color: user?.signature
											? "#ffffff"
											: "#cccccc",
									}}
								>
									{user?.signature
										? user.signature
										: t("signature")}
								</p>
							</div>
						</div>
					</div>
					<div className="center">
						{chat?.messages?.map((message, index) => (
							<div
								className={
									message.senderId === currentUser?.id
										? "message own"
										: "message"
								}
								key={index}
							>
								<div className="texts">
									{message.img && (
										<Image.PreviewGroup
											items={imgPreviewList}
										>
											<Image src={message.img} />
										</Image.PreviewGroup>
									)}
									{message.text && (
										<div>
											<p>{message.text}</p>
											<span>
												{dayjs(
													message.createdAt
												).format("HH:mm A")}
											</span>
										</div>
									)}
								</div>
							</div>
						))}
						{img.url && (
							<div className="message own">
								<div className="texts">
									<Image src={img.url} alt="" />
								</div>
							</div>
						)}
						<div ref={endRef}></div>
					</div>
					<div className="bottom">
						<div className="icons">
							<label htmlFor="file">
								<img src="./img.png" alt="" />
							</label>
							<input
								type="file"
								id="file"
								style={{ display: "none" }}
								onChange={handleImg}
							/>
							<img
								src="./camera.png"
								alt=""
								onClick={handleCamera}
							/>
							<img
								className={isRecoginition ? "mic" : ""}
								src="./mic.png"
								onClick={() => {
									if (isRecoginition) {
										recognition.stop();
										setIsRecoginition(false);
									} else {
										recognition.start();
										setIsRecoginition(true);
									}
								}}
								alt=""
							/>
						</div>
						<input
							type="text"
							placeholder={t("chat.sendPlaceholder")}
							value={text}
							onChange={(e) => setText(e.target.value)}
							disabled={isCurrentUserBlocked || isReceiverBlocked}
						/>
						<div className="emoji">
							<img
								src="./emoji.png"
								alt=""
								onClick={() => setOpen((prev) => !prev)}
							/>
							<div className="picker">
								<EmojiPicker
									open={open}
									onEmojiClick={handleEmoji}
								/>
							</div>
						</div>
						<button
							className="sendButton"
							onClick={() => {
								handleSend("text");
							}}
							disabled={isCurrentUserBlocked || isReceiverBlocked}
						>
							{t("chat.sendBtn")}
						</button>
					</div>
					<Modal
						title="Basic Modal"
						open={isModalOpen}
						onCancel={handleCancel}
						footer={null}
					>
						<div className="videoBox">
							<video
								ref={videoRef}
								style={{
									display: img.url ? "none" : "block",
								}}
								id="video"
								autoPlay
							></video>
							<canvas
								ref={canvasRef}
								style={{
									display: img.url ? "block" : "none",
									borderRadius: "16px",
								}}
								width="472"
								height="354"
							></canvas>
						</div>
						<div className="modalBottom">
							<Button
								style={{ flex: 1 }}
								icon={<CameraOutlined />}
								onClick={() => {
									DrawPicture();
								}}
							>
								{t("chat.photoBtn")}
							</Button>
							<Button
								style={{ flex: 1 }}
								type="primary"
								icon={<SendOutlined />}
								onClick={handleOk}
							>
								{t("chat.sendBtn")}
							</Button>
						</div>
					</Modal>
				</div>
			) : (
				<div className="noChat">
					<Spin />
				</div>
			)}
		</>
	);
};

export default React.memo(Chat);
