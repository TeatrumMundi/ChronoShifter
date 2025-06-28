export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Banner Skeleton */}
            <div className="flex flex-col lg:flex-row items-center bg-gray-900/70 rounded-sm shadow-lg p-6 gap-6 animate-pulse">
                {/* Summoner Icon Placeholder */}
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-700/30 rounded-sm" />
                    <div className="absolute bottom-0 w-full bg-black/70 rounded-b-sm px-2 py-1 text-xs text-white text-center shadow-md" />
                </div>
                {/* Summoner Info Placeholder */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="h-8 bg-gray-700/30 rounded w-1/2" />
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="h-6 bg-gray-700/30 rounded w-1/3" />
                        <div className="h-10 bg-blue-600 rounded-sm w-24" />
                    </div>
                </div>
            </div>

            {/* Match List Skeleton */}
            <div className="mt-6">
                {/* Header Placeholder */}
                <div className="h-8 bg-gray-800 rounded-sm p-1 animate-pulse mb-2" />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 bg-gray-800/80 rounded-sm animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}