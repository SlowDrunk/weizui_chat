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
import { useTransition } from "react";


export default function AddUser() {
	const { currentUser } = useUserStore();
  const {t} = useTransition
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
		const chatRef = collection(db, "charts");
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
      toast.success(t('userList.addMessage'))
		} catch (err) {
			console.error(err);
      toast.error(err)
		}
	};
	return (
		<div className="addUser">
			<form action="" onSubmit={handleSearch}>
				<input type="text" placeholder="用户名" name="username" />
				<button>{t('userList.searchPlaceholder')}</button>
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
					<button onClick={handleAdd}>{t('userList.addBtn')}</button>
				</div>
			)}
		</div>
	);
}
