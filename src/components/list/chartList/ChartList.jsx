import React, { useState } from "react";
import "./chartList.css";
import AddUser from "./addUser";
import { useTranslation } from "react-i18next";

export default function ChartList() {
	const {t} = useTranslation()
	const [addMode, setAddMode] = useState(false);
	return (
		<div className="chatList">
			<div className="search">
				<div className="searchBar">
					<img className="searchIcon" src="./search.png" alt="" />
					<input type="text" placeholder={t('userList.searchPlaceholder')} />
				</div>
				<img
					className="add"
					src={addMode ? "./minus.png" : "./plus.png"}
					alt=""
					onClick={() => setAddMode((pre) => !pre)}
				/>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			<div className="item">
				<img src="./avatar.png" alt="" />
				<div className="texts">
					<span>weizui~</span>
					<p>hello</p>
				</div>
			</div>
			{addMode && <AddUser></AddUser>}
		</div>
	);
}
