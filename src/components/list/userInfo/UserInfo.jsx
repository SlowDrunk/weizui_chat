import React from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
export default function UserInfo() {
	const {currentUser} = useUserStore()
	return (
		<div className="userInfo">
			<div className="user">
				<img src={currentUser.avatar ? currentUser.avatar : './avatar.png'} alt="" />
				<h2>{currentUser.username}</h2>
			</div>
			<div className="icons">
				<img className="icon" src="./more.png" alt="" />
				<img className="icon" src="./video.png" alt="" />
				<img className="icon" src="./edit.png" alt="" />
			</div>
		</div>
	);
}
