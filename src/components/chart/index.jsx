import "./chart.css";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import {useTranslation} from 'react-i18next'

export default function Chart() {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const {t} = useTranslation()
	const handleEmoji = (event) => {
		setText((pre) => pre + event.emoji);
	};
	return (
		<div className="chat">
			<div className="top">
				<div className="user">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<span>WeiZui</span>
						<p>hello，happly NewYear</p>
					</div>
				</div>
				<div className="icons">
					<img src="./phone.png" alt="" />
					<img src="./video.png" alt="" />
					<img src="./info.png" alt="" />
				</div>
			</div>
			<div className="center">
				<div className="message">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
				<div className="message own">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
				<div className="message">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
				<div className="message">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
				<div className="message">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
				<div className="message">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
				<div className="message own">
					<img src="./avatar.png" alt="" />
					<div className="texts">
						<p>
							ijawbdbkjawbdbawdi njnaswdklnwoandhaw
							jkwajdklnwandnawdn dnkjawndlnawndlkawndlknawlkn
						</p>
						<span>1 分钟前</span>
					</div>
				</div>
			</div>
			<div className="bottom">
				<div className="icons">
					<img src="./img.png" alt="" />
					<img src="./camera.png" alt="" />
					<img src="./mic.png" alt="" />
				</div>
				<input
					type="text"
					placeholder={t('chat.sendPlaceholder')}
					value={text}
					onChange={(e) => {
						setText(e.target.value);
					}}
				/>
				<div className="emoji">
					<img
						src="./emoji.png"
						alt=""
						onClick={() => setOpen((pre) => !pre)}
					/>
					<div className="picker">
						<EmojiPicker open={open} onEmojiClick={handleEmoji} />
					</div>
				</div>
				<button className="sendButton">{t('chat.sendBtn')}</button>
			</div>
		</div>
	);
}
