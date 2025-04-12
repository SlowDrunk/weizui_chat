import React from "react";
import "./addUser.css";
import {
	collection,
	where,
	query,
	getDocs,
	setDoc,
	doc,
	serverTimestamp,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@ant-design/icons";

export default function AddUser(props) {
	const { setAddMode } = props;
	const { currentUser } = useUserStore();
	const { t } = useTranslation();
	const [user, setUser] = useState();
	const handleSearch = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const username = formData.get("username");
		try {
			const userRef = collection(db, "users");

			const q = query(userRef, where("username", "==", username));

			const querySnapShot = await getDocs(q);

			if (!querySnapShot.empty) {
				setUser(querySnapShot.docs[0].data());
			}
		} catch (err) {
			console.error(err);
		} finally {
			e.target.reset();
		}
	};

	const handleAdd = async () => {
		const chatRef = collection(db, "chats");

		const userChatsRef = collection(db, "userchats");

		try {
			const newChatRef = doc(chatRef);

			await setDoc(newChatRef, {
				createdAt: serverTimestamp(),
				messages: [],
			});

			await updateDoc(doc(userChatsRef, user.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: currentUser.id,
					updatedAt: Date.now(),
				}),
			});

			await updateDoc(doc(userChatsRef, currentUser.id), {
				chats: arrayUnion({
					chatId: newChatRef.id,
					lastMessage: "",
					receiverId: user.id,
					updatedAt: Date.now(),
				}),
			});

			toast.success(t("userList.addMessage"));
		} catch (err) {
			console.error(err);
			toast.error(err);
		} finally {
			setAddMode(false);
		}
	};
	return (
		<div className="addUser">
			<div className="close-icon" onClick={() => setAddMode(false)}>
				<CloseOutlined />
			</div>
			<form action="" onSubmit={handleSearch}>
				<input type="text" placeholder="用户名" name="username" />
				<button>{t("userList.searchPlaceholder")}</button>
			</form>
			{user && (
				<div className="user">
					<div className="detail">
						<img
							src={user.avatar ? user.avatar : "./avatar.png"}
							alt=""
						/>
						<span>{user.username}</span>
					</div>
					<button onClick={handleAdd}>{t("userList.addBtn")}</button>
				</div>
			)}
		</div>
	);
}
