import React, { useState } from "react";
import "./chartList.css";
import AddUser from "./addUser";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../../lib/userStore";
import { useEffect } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function ChartList() {
	const { t } = useTranslation();
	const [addMode, setAddMode] = useState(false);
	const [chats, setChats] = useState([]);

	const { currentUser } = useUserStore();

	useEffect(() => {
		const unsub = onSnapshot(
			doc(db, "userchats", currentUser.id),
			async (res) => {
				const items = res.data().chats;
				const promistArr = items.map(async (item) => {
					const userRef = doc(db, "users", item.receiverId);
					const userSnap = await getDoc(userRef);
					const user = userSnap.data();
					return { ...item, user };
				});
				const chartData = await Promise.all(promistArr);
				setChats(chartData.sort((a, b) => b.updatedAt - a.updatedAt));
			}
		);
		return () => {
			unsub();
		};
	}, [currentUser.id]);
	return (
		<div className="chatList">
			<div className="search">
				<div className="searchBar">
					<img className="searchIcon" src="./search.png" alt="" />
					<input
						type="text"
						placeholder={t("userList.searchPlaceholder")}
					/>
				</div>
				<img
					className="add"
					src={addMode ? "./minus.png" : "./plus.png"}
					alt=""
					onClick={() => setAddMode((pre) => !pre)}
				/>
			</div>
			{chats.map((chat) => {
				return (
					<div className="item" key={chat.chatId}>
						<img
							src={
								chat.user.avatar
									? chat.user.avatar
									: "./avatar.png"
							}
							alt=""
						/>
						<div className="texts">
							<span>{chat.user.username}</span>
							<p>{chat.lastMessage}</p>
						</div>
					</div>
				);
			})}
			{addMode && <AddUser></AddUser>}
		</div>
	);
}
