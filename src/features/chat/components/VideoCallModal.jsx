import React from 'react';
import Button from '../../../shared/components/Button';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

export default function VideoCallModal({
    localStream,
    remoteStream,
    callStatus,
    onAccept,
    onReject,
    onEnd,
    callerName = "User",
    onToggleAudio,
    onToggleVideo,
    isAudioEnabled = true,
    isVideoEnabled = true
}) {
    if (callStatus === 'idle') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Incoming Call Overlay */}
            {callStatus === 'incoming' && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce-slight">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                        <Video className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{callerName}</h2>
                    <p className="text-slate-500 mb-8">Incoming Video Call...</p>
                    <div className="flex gap-6">
                        <Button
                            onClick={onReject}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </Button>
                        <Button
                            onClick={onAccept}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center shadow-lg transition-transform hover:scale-110 animate-pulse"
                        >
                            <Video className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Active/Outgoing Call Interface */}
            {(callStatus === 'active' || callStatus === 'outgoing') && (
                <div className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">

                    {/* Remote Stream (Main) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {remoteStream ? (
                            <video
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                ref={video => { if (video) video.srcObject = remoteStream }}
                            />
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-800 mx-auto mb-4 flex items-center justify-center animate-pulse">
                                    <span className="text-2xl text-slate-400 font-bold">{(callerName || "User")[0]}</span>
                                </div>
                                <p className="text-slate-400 text-lg">
                                    {callStatus === 'outgoing' ? 'Calling...' : 'Waiting for video...'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Local Stream (PIP) */}
                    <div className="absolute bottom-6 right-6 w-48 h-36 bg-black rounded-xl border-2 border-slate-700 overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                        {localStream ? (
                            <video
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover mirror"
                                ref={video => { if (video) video.srcObject = localStream }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                <VideoOff className="text-slate-500 w-6 h-6" />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/80 backdrop-blur px-6 py-3 rounded-full border border-slate-700/50">
                        <button
                            onClick={onToggleAudio}
                            className={`p-3 rounded-full transition-colors ${isAudioEnabled ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={onEnd}
                            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </button>

                        <button
                            onClick={onToggleVideo}
                            className={`p-3 rounded-full transition-colors ${isVideoEnabled ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Add CSS module or style tag helper if needed for 'mirror' class
// For now, assume Tailwind is enough but 'mirror' { transform: scaleX(-1) } is useful.
