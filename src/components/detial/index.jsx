import React from "react";
import "./detial.css";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Space, Switch } from "antd";
import { useState } from "react";

export default function Detial() {
	const { t, i18n } = useTranslation();
	const [lang, setLang] = useState(i18n.language);
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
	const handleBlock = async () => {};

	const handleLogout = () => {
		auth.signOut();
		resetChat();
	};

	return (
		<div className="detail">
			<div className="user">
				<img
					src={
						currentUser.avatar ? currentUser.avatar : "./avatar.png"
					}
					alt=""
				/>
				<h2>{currentUser.username}</h2>
				<p>A greatful Hansband,Supper Cool!</p>
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
									onChange={(val) => {
										i18n.changeLanguage(val ? "zh" : "en");
									}}
								/>
							</Space>
						</div>
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>{t("userInfo.sharedImg")}</span>
						<img src={showPhotos ? "./arrowUp.png" : "./arrowDown.png"} alt="" onClick={()=>setShowPhotos((pre)=>!pre)} />
					</div>
					<div
						className="photos"
						style={{ display: showPhotos ? "block" : "none" }}
					>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
						<div className="photoItem">
							<div className="photoDetail">
								<img
									src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
									alt=""
								/>
								<span>photo_2024_2.png</span>
							</div>
							<img src="./download.png" alt="" className="icon" />
						</div>
					</div>
				</div>
			</div>
			<div className="button-container">
				<button onClick={handleBlock}>
					{currentUser.blocked ? "Unblock" : "Blocked"}
				</button>
				<button className="logout" onClick={handleLogout}>
					{t("userInfo.loginOut")}
				</button>
			</div>
		</div>
	);
}
