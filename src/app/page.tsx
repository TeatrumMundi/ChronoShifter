import { Background } from "@/components/common";
import SearchForm from "@/components/common/SearchForm";
import { Footer, Header } from "@/components/mainPage";

export default function Home() {
    return (
        <div className="relative min-h-dvh text-white overflow-hidden flex flex-col" style={{ fontFamily: "var(--font-verminVibes)" }}>
            <Background quality={100} />
            <Header />
            <div className="flex-grow relative">
                <SearchForm />
            </div>
            <Footer />
        </div>
    );
}