import React from 'react'
import './addUser.css'

export default function AddUser() {
  return (
    <div className='addUser'>
        <form action="">
            <input type="text" placeholder='用户名' name='username' />
            <button>搜索</button>
        </form>
        <div className="user">
            <div className="detail">
                <img src="./avatar.png" alt="" />
                <span>Wei Zui</span>
            </div>
            <button>添加用户</button>
        </div>
    </div>
  )
}
