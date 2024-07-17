import React, { useState, useEffect } from "react";
import "./detial.css";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import {
	arrayRemove,
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Space, Switch } from "antd";
import { handleDownload } from "../../lib/useDownload";
import { Image, Tooltip } from "antd";

export default function Detial() {
	const { t, i18n } = useTranslation();
	const [lang, setLang] = useState(localStorage.getItem("lang"));
	const [photos, setPhotos] = useState([]);
	const [chats, setChats] = useState();
	const [showPhotos, setShowPhotos] = useState(false);
	const { fetchUserInfo, currentUser } = useUserStore();
	const {
		chatId,
		user,
		isCurrentUserBlocked,
		isReceiverBlocked,
		changeBlock,
		resetChat,
	} = useChatStore();
	useEffect(() => {
		const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
			setChats(res.data());
		});

		return () => {
			unSub();
		};
	}, [chatId]);

	useEffect(() => {
		if (chats) {
			const photos = chats.messages
				.filter((ele) => ele.img)
				.map((message) => {
					return {
						id: message.senderId,
						img: message.img,
					};
				});
			setPhotos(photos || []);
			setShowPhotos(photos.length);
		}
	}, [chats]);

	const handleBlock = async () => {
		if (!user) return;
		const userDocRef = doc(db, "users", currentUser.id);
		try {
			await updateDoc(userDocRef, {
				blocked: isReceiverBlocked
					? arrayRemove(user.id)
					: arrayUnion(user.id),
			});
			changeBlock();
		} catch (e) {
			console.log(e);
		}
	};

	const handleLogout = () => {
		auth.signOut();
		resetChat();
	};

	const handleLang = (val) => {
		i18n.changeLanguage(val ? "zh" : "en");
		setLang(val ? "zh" : "en");
		i18n.changeLanguage(val ? "zh" : "en");
		localStorage.setItem("lang", val ? "zh" : "en");
	};

	return (
		<div className="detail">
			<div className="user">
				<img src={user.avatar ? user.avatar : "./avatar.png"} alt="" />
				<h2>{user.username}</h2>
				<p
					style={{
						color: user.signature ? "#ffffff" : "#cccccc",
					}}
				>
					{user.signature ? user.signature : t("signature")}
				</p>
			</div>
			<div className="info">
				<div className="option">
					<div className="title">
						<span>{t("userInfo.chatSeting")}</span>
						<div>
							<Space direction="vertical">
								<Switch
									checkedChildren="中文"
									unCheckedChildren="english"
									defaultChecked
									onChange={(val) => handleLang(val)}
								/>
							</Space>
						</div>
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>{t("userInfo.sharedImg")}</span>
						<img
							src={
								showPhotos ? "./arrowUp.png" : "./arrowDown.png"
							}
							alt=""
							onClick={() => setShowPhotos((pre) => !pre)}
						/>
					</div>
					<div
						className="photos"
						style={{ display: showPhotos ? "block" : "none" }}
					>
						{photos &&
							photos.map((photo) => (
								<div className="photoItem" key={photo.id}>
									<div className="photoDetail">
										<Image src={photo.img} alt="" />
										<Tooltip title={photo.id}>
											<span>{photo.id}</span>
										</Tooltip>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			<div className="button-container">
				<button onClick={handleBlock}>
					{isCurrentUserBlocked
						? "You Are Blocked!"
						: isReceiverBlocked
						? "User Blocked You!"
						: "Block User"}
				</button>
				<button className="logout" onClick={handleLogout}>
					{t("userInfo.loginOut")}
				</button>
			</div>
		</div>
	);
}
