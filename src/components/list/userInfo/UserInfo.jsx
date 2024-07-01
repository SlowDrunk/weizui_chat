import React from "react";
import "./userInfo.css";

export default function UserInfo() {
	return (
		<div className="userInfo">
			<div className="user">
				<img src="./avatar.png" alt="" />
				<h2>weizui~</h2>
			</div>
			<div className="icons">
				<img className="icon" src="./more.png" alt="" />
				<img className="icon" src="./video.png" alt="" />
				<img className="icon" src="./edit.png" alt="" />
			</div>
		</div>
	);
}
