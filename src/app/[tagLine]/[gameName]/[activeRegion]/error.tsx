"use client"

import ErrorPage from "@/components/common/ErrorPage";

export default function Error() {
    return (
        <ErrorPage
            imagePath="/responseCodes/error_404.png"
            errorMessage="Oops! Something went wrong while loading the profile."
        />
    );
}