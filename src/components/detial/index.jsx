import React from "react";
import "./detial.css";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../lib/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function Detial() {
	const { t } = useTranslation();
	const { fetchUserInfo, currentUser } = useUserStore();
	const handleBlock = async () => {};

	const handleLogout = () => {
		const unSub = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user.uid);
		});
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
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
				{/* <div className="option">
					<div className="title">
						<span>Chat Settings</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div> */}
				<div className="option">
					<div className="title">
						<span>{t("userInfo.privacyPolicy")}</span>
						<img src="./arrowUp.png" alt="" />
					</div>
				</div>
				<div className="option">
					<div className="title">
						<span>{t("userInfo.sharedImg")}</span>
						<img src="./arrowDown.png" alt="" />
					</div>
					<div className="photos">
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
				<div className="option">
					<div className="title">
						<span>{t("userInfo.sharedFile")}</span>
						<img src="./arrowUp.png" alt="" />
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
