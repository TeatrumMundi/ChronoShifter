import { memo } from "react";

export const LoadingSpinner = memo(function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-4 min-h-[120px]">
            <div className="relative">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            </div>
        </div>
    );
});

LoadingSpinner.displayName = "LoadingSpinner";
