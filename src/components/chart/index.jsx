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
import { Image } from "antd";

const Chat = () => {
	const [chat, setChat] = useState();
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const { t } = useTranslation();
	const [img, setImg] = useState({
		file: null,
		url: "",
	});
	const { currentUser } = useUserStore();
	const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
		useChatStore();
	const endRef = useRef(null);

	useEffect(() => {
		const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
			setChat(res.data());
		});

		return () => {
			unSub();
		};
	}, [chatId]);

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

	return (
		<div className="chat">
			<div className="top">
				<div className="user">
					<img src={user?.avatar || "./avatar.png"} alt="" />
					<div className="texts">
						<span>{user?.username}</span>
						<p
							style={{
								color: user?.signature ? "#ffffff" : "#cccccc",
							}}
						>
							{user?.signature ? user.signature : t("signature")}
						</p>
					</div>
				</div>
				<div className="icons">
					<img src="./phone.png" alt="" />
					<img src="./video.png" alt="" />
					<img src="./info.png" alt="" />
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
							{message.img && <Image src={message.img} alt="" />}
							{message.text && (
								<div>
									<p>{message.text}</p>
									<span>
										{dayjs(message.createdAt).format(
											"HH:mm A"
										)}
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
					<img src="./camera.png" alt="" />
					<img src="./mic.png" alt="" />
				</div>
				<input
					type="text"
					placeholder={
						isCurrentUserBlocked || isReceiverBlocked
							? "You cannot send a message"
							: "Type a message..."
					}
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
						<EmojiPicker open={open} onEmojiClick={handleEmoji} />
					</div>
				</div>
				<button
					className="sendButton"
					onClick={() => {
						handleSend("text");
					}}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default Chat;
