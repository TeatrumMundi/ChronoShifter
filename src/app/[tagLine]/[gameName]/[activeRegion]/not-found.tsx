import ErrorPage from "@/components/common/ErrorPage";

export default function NotFound() 
{
    return ErrorPage("/responseCodes/notfound_404.png" , "We couldn&apos;t find the summoner you&apos;re looking for.");
}