import {MapContainer, TileLayer} from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CreatePost from './CreatePost'
import L from 'leaflet'
import {jwtDecode} from 'jwt-decode'
import Friends from './Friends'

const API = process.env.REACT_APP_API_URL

function Map({setToken}){
    const [posts, setPosts] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [showFriends, setShowFriends] = useState(false)
    const token = localStorage.getItem('token')

    const decoded = jwtDecode(token)
    const my_id = decoded.id

    useEffect(()=>{
        axios.get(`${API}/api/maps`, {headers: {Authorization:`Bearer ${token}`}}).then(response=>{
            setPosts(response.data)
        })
    }, [token, refresh])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken(null)
    }

    return(
        <div className="flex flex-col h-screen">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-3 bg-slate-900/95 backdrop-blur border-b border-white/10 z-[1000] shadow-lg">
                <h1 className="text-white font-bold text-xl tracking-tight">🗺️ GeoJournal</h1>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={()=>setShowFriends(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-white/10"
                    >
                        👥 Friends
                        {/* Badge for received requests could go here later */}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-red-500/30"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Map */}
            <div className="flex-1 relative">
                <MapContainer zoom={12} center={[12.9716, 77.5946]} style={{height:'100%', width:'100%'}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {posts.map(post=>{
                        const ismypost = (post.user_id === my_id)
                        const color = ismypost ? '#f9a8d4' : '#60a5fa'
                        const myicon = L.divIcon({
                            html: `<img src="${post.photo_url}" style="width:50px;height:50px;border-radius:50%;border:3px solid ${color};box-shadow:0 2px 8px rgba(0,0,0,0.4);">`,
                            className:'',
                            iconSize:[50, 50]
                        })
                        return(
                            <Marker key={post.id} position={[post.latitude, post.longitude]} icon={myicon}>
                                <Popup>
                                    <div className="text-sm">
                                        <h3 className="font-semibold text-slate-800">{post.title}</h3>
                                        <p className="text-slate-600 mt-1">{post.body}</p>
                                        {post.location_name && <p className="text-slate-400 text-xs mt-1">📍 {post.location_name}</p>}
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </MapContainer>

                {/* Friends Panel */}
                <Friends isOpen={showFriends} setIsOpen={setShowFriends} setMapRefresh={setRefresh} />

                {/* Create Post FAB */}
                <CreatePost setRefresh={setRefresh} />
            </div>
        </div>
    )
}

export default Map
