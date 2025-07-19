import { useEffect, useRef, useState } from "react"

const ShowSongs = ({ songs }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null);

    useEffect(() => {
        isPlaying ? audioRef?.current?.play() : audioRef?.current?.pause()
    }, [isPlaying])


    return (
        <ul className="flex flex-col bg-zinc-900 p-5 rounded-2xl gap-3">
            {
                songs.length > 0 ?
                    songs.map((song, index) => {
                        return <li key={index} className="flex justify-between items-center bg-zinc-800 p-2 rounded-2xl px-5">
                            <div className="flex gap-5">
                                <div className="w-[10%] aspect-square overflow-hidden rounded-lg">
                                    <img className="w-full h-full object-cover" src={song.audioImage} alt={song.title} />
                                </div>
                                <div>
                                    <h1>{song.title}</h1>
                                    <h3 className="font-extralight">{song.artist}</h3>
                                </div>
                            </div>
                            <div>
                                <audio ref={audioRef} src={song.audio} ></audio>
                                <div onClick={() => setIsPlaying(!isPlaying)
                                } className="mr-5 text-xl">
                                    {
                                        isPlaying ?
                                            <i className="ri-pause-line w-5 h-5"></i>
                                            :
                                            <i className="ri-play-fill w-5 h-5"></i>
                                    }
                                </div>
                            </div>
                        </li>
                    }) : <h1>songs</h1>
            }
        </ul>
    )
}

export default ShowSongs
