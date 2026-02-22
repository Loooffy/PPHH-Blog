export const BookBottomBar = ({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) => (
    <div className="h-12 border-t border-stone-200/50 flex items-center justify-center px-6 bg-white/80 backdrop-blur-md text-xs text-stone-500 font-mono z-10 sticky bottom-0">
        <div className="flex items-center gap-4 w-full max-w-md justify-center">
            <span className="whitespace-nowrap">
                PAGE {currentPage + 1} OF {totalPages}
            </span>
            <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden flex-shrink-0">
                <div
                    className="h-full bg-stone-400 transition-all duration-300 ease-out"
                    style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
            </div>
            <span className="w-8 text-right">
                {Math.round(((currentPage + 1) / totalPages) * 100)}%
            </span>
        </div>
    </div>
);