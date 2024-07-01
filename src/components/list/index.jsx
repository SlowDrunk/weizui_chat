import React from 'react'
import './list.css'
import UserInfo from './userInfo/UserInfo'
import ChartList from './chartList/ChartList'
export default function List() {
  return (
    <div className='list'>
      <UserInfo></UserInfo>
      <ChartList></ChartList>
    </div>
  )
}
