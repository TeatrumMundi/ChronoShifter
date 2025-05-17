import { Background } from "@/components/common";
import SearchForm from "@/components/common/search/SearchForm";
import { Footer, Header } from "@/components/mainPage";



const backgroundMap: Record<number, string> = {
    1: "/main/1.jpg", // Monday
    2: "/main/2.jpg", // Tuesday
    3: "/main/3.jpg", // Wednesday
    4: "/main/4.jpg", // Thursday
    5: "/main/5.jpg", // Friday
    6: "/main/6.jpg", // Saturday
    0: "/main/7.jpg", // Sunday
};

export default function Home() {
    const today = new Date().getDay();
    const splashUrl = backgroundMap[today] || "/main/1.jpg";

    return (
        <div className="relative min-h-dvh text-white overflow-hidden flex flex-col">
            <Background splashUrl={splashUrl} quality={100}/>
            <Header />
            <div className="flex-grow relative">
                <SearchForm />
            </div>
            <Footer />
        </div>
    );
}