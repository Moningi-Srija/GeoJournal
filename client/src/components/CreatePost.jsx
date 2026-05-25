import {useState, useEffect} from 'react'
import axios from 'axios'

function CreatePost({setRefresh}){
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [locationName, setLocationName] = useState('')
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()
    const [manualLocation, setmanualLocation] = useState(false)
    const [images, setImages] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const token = localStorage.getItem('token')

    useEffect(()=>{
        if(!manualLocation){
            navigator.geolocation.getCurrentPosition((pos)=>{
                setLatitude(pos.coords.latitude)
                setLongitude(pos.coords.longitude)
            })
        }
    }, [manualLocation])

    const handleCreatePost = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', title)
        formData.append('body', body)
        formData.append('location_name', locationName)
        formData.append('latitude', latitude)
        formData.append('longitude', longitude)
        for(const image of images){
            formData.append('images', image)
        }
        axios.post(process.env.REACT_APP_API_URL + '/api/posts', formData, {headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'}})
        .then(() => {
            setRefresh(prev => !prev)
            setIsOpen(false)
            setTitle('')
            setBody('')
            setLocationName('')
            setImages([])
        })
    }

    return(
        <div className="fixed bottom-6 right-6 z-[1000]">
            {!isOpen ? (
                <button
                    onClick={()=>setIsOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                    +
                </button>
            ) : (
                <div className="bg-slate-900/95 backdrop-blur border border-white/20 rounded-2xl p-6 w-80 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white font-semibold text-lg">New Post</h2>
                        <button onClick={()=>setIsOpen(false)} className="text-white/50 hover:text-white text-xl">✕</button>
                    </div>
                    <form onSubmit={handleCreatePost} className="space-y-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e)=>{setTitle(e.target.value)}}
                            placeholder="Title"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400"
                        />
                        <textarea
                            value={body}
                            onChange={(e)=>{setBody(e.target.value)}}
                            placeholder="Write your journal entry..."
                            rows={3}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400 resize-none"
                        />
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e)=>setLocationName(e.target.value)}
                            placeholder="Location name"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400"
                        />
                        <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={manualLocation}
                                onChange={(e)=>setmanualLocation(e.target.checked)}
                                className="accent-blue-400"
                            />
                            Enter coordinates manually
                        </label>
                        {manualLocation && (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={latitude}
                                    onChange={(e)=>{setLatitude(e.target.value)}}
                                    placeholder="Latitude"
                                    className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400"
                                />
                                <input
                                    type="number"
                                    value={longitude}
                                    onChange={(e)=>{setLongitude(e.target.value)}}
                                    placeholder="Longitude"
                                    className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept='.png,.jpg,.jpeg'
                            multiple
                            onChange={(e)=>setImages(Array.from(e.target.files))}
                            className="w-full text-white/60 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                        />
                        <button
                            type='submit'
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                        >
                            Post to Map
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CreatePost
