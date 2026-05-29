"use server";

import DBConnection from "../utils/config/db";
import User from "../utils/models/User";
import bcrypt from "bcryptjs";

export async function registerAction(registerdetails) {
    await DBConnection();
    try {
        const existingUser = await User.findOne({ email: registerdetails.email });
        if (existingUser) {
            return { success: false, error: "Email is already registered" };
        }

        const hashedPassword = await bcrypt.hash(registerdetails.password, 10);

        await User.create({
            name: registerdetails.name,
            email: registerdetails.email,
            password: hashedPassword
        });

        console.log("User created successfully");
        return { success: true };
    }
    catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

