"use client";

import ErrorPage from "@/components/common/ErrorPage";

export default function Error() 
{
    return ErrorPage("/responseCodes/error_404.png" , "Oops! Something went wrong while loading the profile.");
}