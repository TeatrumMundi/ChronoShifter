"use client";

import React, { useState, useRef } from "react";

interface UpdateButtonProps {
    onUpdate?: () => Promise<boolean> | boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

export default function UpdateButton({ 
    onUpdate,
    className = "",
    size = "md",
    disabled = false
}: UpdateButtonProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const clickSoundRef = useRef<HTMLAudioElement>(null);
    const successSoundRef = useRef<HTMLAudioElement>(null);
    const errorSoundRef = useRef<HTMLAudioElement>(null);

    const sizeClasses = {
        sm: "px-4 py-2 text-xs min-w-[100px]",
        md: "px-6 py-3 text-sm min-w-[200px]",
        lg: "px-8 py-4 text-base min-w-[300px]"
    };

    const iconSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4", 
        lg: "w-5 h-5"
    };

    const handleUpdateClick = async () => {
        if (isUpdating) return;
        
        // Play click sound
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(() => {});
        }
        
        setIsUpdating(true);
        setProgress(0);
        setStatus("idle");
        
        // Simulate progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        try {
            // Call the actual update function if provided
            const result = onUpdate ? await onUpdate() : true;
            
            // Wait for progress animation to complete
            await new Promise<void>(resolve => {
                const waitForProgress = setInterval(() => {
                    setProgress(current => {
                        if (current >= 100) {
                            clearInterval(waitForProgress);
                            resolve();
                            return 100;
                        }
                        return current;
                    });
                }, 50);
            });

            setIsUpdating(false);
            
            if (result) {
                setStatus("success");
                // Play success sound
                if (successSoundRef.current) {
                    successSoundRef.current.currentTime = 0;
                    successSoundRef.current.play().catch(() => {});
                }
            } else {
                setStatus("error");
                // Play error sound
                if (errorSoundRef.current) {
                    errorSoundRef.current.currentTime = 0;
                    errorSoundRef.current.play().catch(() => {});
                }
            }
            
            // Reset status and progress after delay
            setTimeout(() => {
                setStatus("idle");
                setProgress(0);
            }, 2000);
            
        } catch {
            clearInterval(progressInterval);
            setIsUpdating(false);
            setStatus("error");
            
            // Reset status and progress after delay
            setTimeout(() => {
                setStatus("idle");
                setProgress(0);
            }, 2000);
        }
    };

    const getButtonContent = () => {
        if (status === "success") {
            return (
                <>
                    <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Success!
                </>
            );
        }
        
        if (status === "error") {
            return (
                <>
                    <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Failed!
                </>
            );
        }
        
        if (isUpdating) {
            return (
                <>
                    <div className={`${iconSizes[size]} border-2 border-white/30 border-t-white rounded-full animate-spin`} />
                    Updating...
                </>
            );
        }
        
        return (
            <>
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update
            </>
        );
    };

    const getStatusColors = () => {
        if (status === "success") {
            return "from-green-400/30 via-emerald-400/30 to-green-500/30";
        }
        if (status === "error") {
            return "from-red-400/30 via-rose-400/30 to-red-500/30";
        }
        return "from-blue-400/30 via-cyan-400/30 to-blue-500/30";
    };

    return (
        <>
            <button
                onClick={handleUpdateClick}
                disabled={disabled || isUpdating}
                className={`
                    relative overflow-hidden
                    ${sizeClasses[size]} rounded-xl
                    backdrop-blur-2xl border border-white/30
                    bg-gradient-to-br from-white/20 via-white/10 to-white/5
                    shadow-2xl shadow-black/20
                    text-white font-semibold tracking-wider
                    transition-all duration-300 ease-out
                    hover:from-white/30 hover:via-white/15 hover:to-white/8
                    hover:border-white/40 hover:shadow-3xl hover:shadow-blue-500/10
                    active:scale-95 active:from-white/40 active:via-white/20 active:to-white/10
                    disabled:opacity-70 disabled:cursor-not-allowed
                    group
                    ${className}
                `}
            >
                {/* Progress Fill Animation */}
                <div 
                    className={`absolute inset-0 bg-gradient-to-r ${getStatusColors()} transition-all duration-75 ease-linear`}
                    style={{
                        width: `${progress}%`,
                        opacity: isUpdating || status !== "idle" ? 0.8 : 0
                    }}
                />
                
                {/* Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-2 tracking-[.25em] w-full">
                    {getButtonContent()}
                </span>
            </button>
            
            {/* Audio Elements */}
            <audio ref={clickSoundRef} preload="auto">
                <source src="/sounds/click.mp3" type="audio/mpeg" />
            </audio>
            <audio ref={successSoundRef} preload="auto">
                <source src="/sounds/success.mp3" type="audio/mpeg" />
            </audio>
            <audio ref={errorSoundRef} preload="auto">
                <source src="/sounds/error.mp3" type="audio/mpeg" />
            </audio>
        </>
    );
}
