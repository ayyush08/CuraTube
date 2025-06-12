"use client"

import type React from "react"
import { Camera, Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"

interface ProfileImageUploadProps {
    formData: {
        coverImage?: File | null;
        avatar: File | null;
        [key: string]: any;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    className?: string;
}

export default function ProfileImageUpload({ formData, setFormData, className = "" }: ProfileImageUploadProps) {
    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setFormData((prev: any) => ({ ...prev, coverImage: file }))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setFormData((prev: any) => ({ ...prev, avatar: file }))
    }

    const removeCoverImage = () => {
        setFormData((prev: any) => ({ ...prev, coverImage: null }))
    }

    const removeAvatar = () => {
        setFormData((prev: any) => ({ ...prev, avatar: null }))
    }

    useEffect(()=>{

    },[formData.avatar,formData.coverImage])

    return (
        <div className={`w-full ${className}`}>
            {/* Cover Image Section */}
            <div className="relative h-32 w-full bg-gradient-to-br from-orange-50 to-orange-100 rounded-t-2xl overflow-hidden group">
                {formData.coverImage ? (
                    <>
                        <img
                            src={URL.createObjectURL(formData.coverImage) || "/placeholder.svg"}
                            alt="Cover"
                            className="w-full h-full object-cover pointer-events-none select-none"
                        />
                        <div className="absolute inset-0 bg-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="flex gap-2">
                                <Label htmlFor="cover-upload" className="cursor-pointer focus-visible:ring-0 focus-visible:outline-none ">
                                    <Button variant="secondary" size="sm" className="gap-1 text-xs" asChild>
                                        <span>
                                            <Camera className="h-3 w-3" />
                                            Change
                                        </span>
                                    </Button>
                                </Label>
                                <Button variant="destructive" size="sm" onClick={removeCoverImage} className="gap-1 text-xs">
                                    <X className="h-3 w-3" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-orange-500 group-hover:text-orange-700 transition-colors">
                        <Upload className="h-6 w-6 mb-1" />
                        <p className="text-xs font-medium">Upload Cover Image</p>
                        <Label htmlFor="cover-upload" className="absolute inset-0 cursor-pointer" />
                    </div>
                )}

                <Input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
            </div>

            {/* Avatar Section */}
            <div className="relative px-4 pb-4">
                <div className="relative -mt-10">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="w-full h-full rounded-full border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden shadow-lg group">
                            {formData.avatar ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(formData.avatar) || "/placeholder.svg"}
                                        alt="Avatar"
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                        <div className="flex flex-col justify-center gap-1">
                                            <Label htmlFor="avatar-upload" className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:outline-none">
                                                <Button variant="secondary" size="sm" className="gap-1 text-xs p-1 h-auto" asChild>
                                                    <span>
                                                        <Camera className="h-3 w-3 text-center" />
                                                        
                                                    </span>
                                                </Button>
                                            </Label>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={removeAvatar}
                                                className="gap-1 text-xs p-1 h-auto cursor-pointer"
                                            >
                                                <X className="h-3 w-3" />
                                                
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-orange-500 group-hover:text-orange-700 transition-colors">
                                    <Camera className="h-5 w-5 mb-1" />
                                    <p className="text-xs">Profile Pic</p>
                                    <Label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer" />
                                </div>
                            )}
                        </div>

                        <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

                    </div>
                </div>
            </div>
        </div>
    )
}
