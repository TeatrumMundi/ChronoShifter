import { Background, Footer, SearchForm } from "@/components/common";

import { Header } from "@/components/mainPage/Header";

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