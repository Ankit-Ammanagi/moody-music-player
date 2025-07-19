import { useState } from 'react'
import FaceDetection from './components/FaceDetection'
import ShowSongs from './components/ShowSongs'
import 'remixicon/fonts/remixicon.css'

const App = () => {
  const [songs, setSongs] = useState([])

  return (
    <div className='bg-zinc-800 w-full h-screen text-white p-10 font-[Poppins]'>
      <FaceDetection setSongs={setSongs}/>
      <ShowSongs songs={songs}/>
    </div>
  )
}

export default App
