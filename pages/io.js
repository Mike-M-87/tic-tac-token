import { useEffect, useState } from "react"
import io from 'socket.io-client';
let socket


const Some = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    socketInitializer(), []
  })

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected');
    })
    socket.on('update-input', msg => {
      setInput(msg)
    })
  }



  const onChangeHandler = (e) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
  }

  return (
    <>
      <input
        className="m-5 p-3 bg-white border shadow-sm border-pink-500 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-pink-500 rounded-md sm:text-sm focus:ring-1"
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
    </>
  )
}

export default Some