import React, { useState } from "react";
import "./chartList.css";
import AddUser from "./addUser";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../../lib/userStore";
import { useEffect } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import dayjs from "dayjs";
import { useChatStore } from "../../../lib/chatStore";

export default function ChartList() {
	const { t } = useTranslation();
	const { changeChat } = useChatStore();
	const { currentUser } = useUserStore();

	const [addMode, setAddMode] = useState(false);
	const [chats, setChats] = useState([]);
	const [currentChats, setCurrentChats] = useState([]);
	const [searhText, setSearchText] = useState("");

	useEffect(() => {
		const unsub = onSnapshot(
			doc(db, "userchats", currentUser.id),
			async (res) => {
				if (!res.data()) return;
				const items = res.data().chats;
				const promistArr = items.map(async (item) => {
					const userRef = doc(db, "users", item.receiverId);
					const userSnap = await getDoc(userRef);
					const user = userSnap.data();
					return { ...item, user };
				});
				const chartData = await Promise.all(promistArr);
				let resultChat = [];
				// 如果已经存在的用户就不展示
				chartData.forEach((item) => {
					const index = resultChat.findIndex(
						(chat) => chat.user.id === item.user.id
					);
					if (index === -1) {
						resultChat.push(item);
					}
				});
				setChats(resultChat.sort((a, b) => b.updatedAt - a.updatedAt));
				setCurrentChats(
					resultChat.sort((a, b) => b.updatedAt - a.updatedAt)
				);
			}
		);
		return () => {
			unsub();
		};
	}, [currentUser.id]);

	// TODO:搜索用户列表
	useEffect(() => {
		if (searhText) {
			setCurrentChats(
				chats.filter((chat) => chat.user.username.includes(searhText))
			);
		} else {
			setCurrentChats(chats);
		}
	}, [searhText]);
	// 处理聊天时间，如果是当天现实具体时间，否则显示日期
	const handleUpadteTime = (time) => {
		const dateToCheck = dayjs(time);
		const isSameDay = dateToCheck.isSame(dayjs(), "day");
		if (isSameDay) {
			return dateToCheck.format("HH:mm");
		} else {
			return dateToCheck.format("YYYY-MM-DD");
		}
	};
	// 改变聊天框
	const handleSelect = async (chat) => {
		const userChats = chats.map((item) => {
			const { user, ...rest } = item;
			return rest;
		});
		const chatIndex = userChats.findIndex(
			(item) => item.chatId === chat.chatId
		);
		userChats[chatIndex].isSeen = true;
		const userChatsRef = doc(db, "userchats", currentUser.id);
		try {
			await updateDoc(userChatsRef, { chats: userChats });
			changeChat(chat.chatId, chat.user);
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className="chatList">
			<div className="search">
				<div className="searchBar">
					<img className="searchIcon" src="./search.png" alt="" />
					<input
						type="text"
						placeholder={t("userList.searchPlaceholder")}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</div>
				<img
					className="add"
					src={addMode ? "./minus.png" : "./plus.png"}
					alt=""
					onClick={() => setAddMode((pre) => !pre)}
				/>
			</div>
			{currentChats.map((chat) => {
				return (
					<div
						className="item"
						key={chat.chatId}
						onClick={() => handleSelect(chat)}
						style={{
							backgroundColor: chat.isSeen
								? "transparent"
								: "#5183fe",
						}}
					>
						<div className="userinfo">
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
						<div
							style={{
								fontSize: "12px",
								color: "#ccc",
								width: "80px",
								textAlign: "right",
							}}
						>
							<span>{handleUpadteTime(chat.updatedAt)}</span>
						</div>
					</div>
				);
			})}
			{addMode && <AddUser setAddMode={setAddMode}></AddUser>}
		</div>
	);
}
