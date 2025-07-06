import { CheckCircle, ImageIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"

export function ThumbnailUploadZone({
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
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer duration-300 ${dragOver
                ? "border-orange-400 bg-orange-500/20"
                : file
                    ? "border-green-500 bg-green-500/10"
                    : "border-orange-500/50 hover:border-orange-400"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input type="file" accept={accept} onChange={handleFileInput} className="hidden" id="thumbnail-upload" />

            {file ? (
                <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <p className="text-green-400 font-semibold">{file.name}</p>
                    <p className="text-orange-200 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                        className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
                    >
                        Change
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <ImageIcon className="w-16 h-16 text-orange-400 mx-auto" />
                    <p className="text-orange-200">
                        <button
                            type="button"
                            onClick={() => document.getElementById("thumbnail-upload")?.click()}
                            className="text-orange-400 hover:text-orange-300 underline font-semibold"
                        >
                            Upload thumbnail
                        </button>
                    </p>
                    <p className="text-orange-300/70 text-sm">JPG, PNG • Max 10MB</p>
                </div>
            )}
        </div>
    )
}
