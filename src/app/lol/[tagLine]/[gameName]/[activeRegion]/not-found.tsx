import ErrorPage from "@/components/common/ErrorPage";

export default function NotFound() {
    return (
        <ErrorPage
            imagePath="/responseCodes/notfound_404.png"
            errorMessage="We couldn't find the summoner you're looking for."
        />
    );
}