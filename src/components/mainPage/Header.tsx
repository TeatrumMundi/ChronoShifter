export function Header() {
    return (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-full px-10">
            <h1
                className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold uppercase leading-none tracking-[.25em] relative"
                style={{ WebkitTextStroke: "2px white" }}
            >
                <span className="block">CHRONO</span>
                <span
                    className="block mx-auto h-[4px] sm:h-[6px] md:h-[8px] bg-white my-4"
                    style={{ minWidth: "200px", width: "30%", maxWidth: "700px" }}
                ></span>
                <span className="block">SHIFTER</span>
            </h1>
        </div>
    );
}