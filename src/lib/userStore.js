import { create } from "zustand";
import {db} from './firebase' 
import { doc, getDoc } from "firebase/firestore";

// 创建一个zustand的store
export const useUserStore = create((set) => ({
	currentUser: null, //当前登录用户
	isLoading: false, //是否正在加载
	fetchUserInfo: async (uid) => {
		if (!uid) return set({ currentUser: null, isLoading: false });
		try {
			set({ currentUser: null, isLoading: true });
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false });
            }else{
                set({ currentUser: null, isLoading: false });
            }
		} catch (err) {
			console.log(err);
            return set({ currentUser: null, isLoading: false })
		}
	},
}));
