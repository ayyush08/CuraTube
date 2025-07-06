import { Play, Video } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"

export function VideoUploadZone({
    file,
    onFileSelect,
    accept,
}: {
    file: File | null
    onFileSelect: (file: File) => void
    accept: string
}) {
    const [dragOver, setDragOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            onFileSelect(files[0])
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            onFileSelect(files[0])
        }
    }

    return (
        <div
            className={`border-3 border-dashed rounded-2xl p-12 cursor-pointer text-center transition-all duration-300 min-h-[300px] flex flex-col justify-center ${dragOver
                ? "border-orange-400 bg-orange-500/20 scale-105"
                : file
                    ? "border-green-500 bg-green-500/10"
                    : "border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/5"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input type="file" accept={accept} onChange={handleFileInput} className="hidden" id="video-upload" />

            {file ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <div className="bg-green-500/20 p-4 rounded-full">
                            <Play className="w-16 h-16 text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-green-400">{file.name}</h3>
                    <p className="text-orange-200 text-lg">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("video-upload")?.click()}
                        className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-semibold px-8 py-3"
                    >
                        Change Video
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="bg-orange-500/20 p-6 rounded-full">
                            <Video className="w-20 h-20 text-orange-400" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-orange-300 mb-2">Drop your video here</h3>
                        <p className="text-orange-200 text-lg mb-4">
                            or{" "}
                            <button
                                type="button"
                                onClick={() => document.getElementById("video-upload")?.click()}
                                className="text-orange-400 hover:text-orange-300 underline font-semibold cursor-pointer"
                            >
                                browse to upload
                            </button>
                        </p>
                        <p className="text-orange-300/70">Supports MP4, MOV, AVI • Max 500MB</p>
                    </div>
                </div>
            )}
        </div>
    )
}
