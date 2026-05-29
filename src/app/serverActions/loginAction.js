"use server";

import DBConnection from "../utils/config/db";


import { signIn } from "next-auth";

export async function loginAction(loginDetails) {
    await DBConnection();
    try {
        const response = await signIn("credentials", {
            email: loginDetails.email,
            password: loginDetails.password,
            redirect: false,
        })
        if (response.error) {
            return { success: false, error: response.error }
        }
        return { success: true }


    } catch (error) {
        throw new Error("Invalid credentials")
    }
}   