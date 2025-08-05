import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ThumbnailUploadZone } from '@/components/video/ThumbnailUploadZone'
import { VideoUploadZone } from '@/components/video/VideoUploadZone'
import { useAuthGuard } from '@/hooks/helpers/use-auth-guard'
import { usePublishVideo } from '@/hooks/video.hook'
import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, ImageIcon, Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/videos/publish/')({
    component: RouteComponent,
})

function RouteComponent() {
    useAuthGuard()
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPublished: false,
    })

    const { mutate: publishVideo, isPending: publishPending, error: publishError } = usePublishVideo();

    if(publishError) console.log(publishError);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData.title || !formData.description) {
            toast.error("Title and description are required")
            return
        }

        if (!videoFile || !thumbnailFile) {
            toast.error("Both video file and thumbnail are required")
            return
        }
        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('isPublished', String(formData.isPublished))
        formDataToSend.append('videoFile', videoFile)
        formDataToSend.append('thumbnail', thumbnailFile)

        publishVideo(formDataToSend)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isPublished: checked }))
    }

    const handleFileUpload = (file: File, type: "video" | "thumbnail") => {
        if (type === "video") {
            setVideoFile(file)
        } else {
            setThumbnailFile(file)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="container mx-auto  max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-5xl font-bold text-red-500 mb-4">This feature is still under development</h1>
                    <h1 className="text-5xl font-bold text-orange-500 mb-4">Publish a Video</h1>
                    <p className="text-orange-200 text-lg">Share some content on CuraTube</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <Card className="bg-black border-2 border-orange-500/30 shadow-2xl shadow-orange-500/10">
                        
                        <CardContent>
                            <VideoUploadZone
                                file={videoFile}
                                onFileSelect={(file) => handleFileUpload(file, "video")}
                                accept="video/*"
                            />
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Thumbnail Upload */}
                        <Card className="bg-black border border-orange-500/50">
                            <CardHeader>
                                <CardTitle className="text-orange-400 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    Thumbnail
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ThumbnailUploadZone
                                    file={thumbnailFile}
                                    onFileSelect={(file) => handleFileUpload(file, "thumbnail")}
                                    accept="image/*"
                                />
                            </CardContent>
                        </Card>

                        {/* Video Details */}
                        <Card className="lg:col-span-2 bg-black border border-orange-500/50">
                            <CardHeader>
                                <CardTitle className="text-orange-400">Video Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="title" className="text-orange-200 text-lg font-medium">
                                        Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter an engaging title for your video"
                                        className="py-5 text-lg lg:text-xl font-bold border-0 text-white w-full focus-visible:border-0   focus-visible:border-b-2 border-b-2 transition-all duration-300 focus-visible:border-orange-500 focus-visible:ring-0 dark:bg-transparent outline-none rounded-none placeholder-orange-300/40 placeholder:italic resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-orange-200 text-lg font-medium">
                                        Description *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Tell viewers what your video is about..."
                                        rows={4}
                                        className="bg-black  text-white placeholder-orange-300/50 text-md  w-full break-words font-semibold min-h-10  focus-visible:border-b-2 border-b-2 border-b-neutral-700 transition-all duration-300 focus-visible:border-orange-500  placeholder:italic resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-3 p-4  rounded-lg border border-orange-500/30">
                                    <Switch
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onCheckedChange={handleSwitchChange}
                                        className="data-[state=checked]:bg-orange-500 cursor-pointer"
                                    />
                                    <Label htmlFor="isPublished" className="text-orange-200 text-lg">
                                        Publish immediately
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Status Messages */}
                    {publishError && (
                        <Alert className="bg-red-900/50 border-2 border-red-500">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <AlertDescription className="text-red-300 text-lg">{publishError.message}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                        <Button
                            type="submit"
                            disabled={publishPending || !videoFile || !thumbnailFile}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 px-12 text-xl rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                            {publishPending ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Uploading Your Video...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 mr-3" />
                                    Upload Video
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}



