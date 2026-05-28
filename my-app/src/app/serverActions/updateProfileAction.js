"use server";

import DBConnection from "../utils/config/db";
import User from "../utils/models/User";

/**
 * Server action to update user profile information.
 * @param {string} currentEmail - The current email of the user (from session).
 * @param {string} name - The new name.
 * @param {string} email - The new email.
 */
export async function updateProfileAction(currentEmail, name, email) {
    await DBConnection();
    try {
        if (!currentEmail) {
            return { success: false, error: "Not authenticated" };
        }

        // If email is changing, make sure the new email is not already taken
        if (email !== currentEmail) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return { success: false, error: "Email is already registered by another user" };
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: currentEmail },
            { name, email },
            { new: true }
        );

        if (!updatedUser) {
            return { success: false, error: "User not found" };
        }

        console.log("User profile updated successfully in database");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }
}
