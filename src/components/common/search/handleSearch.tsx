"use server";

import { redirect } from "next/navigation";

type FormState = {
    error: string | null;
};

/**
 * Handles form submission on the server side.
 */
export async function handleSearch(prevState: FormState, formData: FormData): Promise<FormState> {
    const server = formData.get("server") as string;
    const nickTag = formData.get("nickTag") as string;

    const [name, tag] = nickTag.split("#");

    redirect(`/${server}/${name}/${tag}`);
}