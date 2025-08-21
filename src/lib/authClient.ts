import { AxiosError } from "axios";
import instance from "./axios";

export type AuthResponse = {
    success: boolean;
    admin?: {
        id: string;
        email: string;
    };
    token?: string;
    error?: string;
}

export const auth = {
    async signUp(email: string, password: string): Promise<AuthResponse | Error> {
        try {
            const response = await instance.post('/auth/signup', { email, password });
            return response.data;

        } catch (err) {
            const error = err as AxiosError<any>;

            return {
                success: false,
                error: error.response?.data?.error || "Authentication failed",
            };
        }
    },
    async signIn(email: string, password: string): Promise<AuthResponse | Error> {
        try {
            const response = await instance.post<AuthResponse>("/auth/signin", {
                email,
                password,
            });

            // console.log("SignIn Response:", response.data);

            // if (response.data.success && response.data.token) {
            //     localStorage.setItem("token", response.data.token);
            // }

            return response.data;
        } catch (err) {
            const error = err as AxiosError<any>;

            return {
                success: false,
                error: error.response?.data?.error || "Authentication failed",
            };
        }
    },

    async signOut() {
        const response = await instance.post<AuthResponse>("/auth/signout", {});

        return { success: true, response: response.data };
    },

    async getUser(token: string): Promise<AuthResponse> {
        try {
            if (!token) {
                return { success: false, error: "Not authenticated" };
            }
            const res = await instance.post("/auth/me", { token });
            console.log("User data fetched:", res.data);

            return res.data;
        } catch (err: any) {
            console.log("User data fetched:", err);
            return { success: false, error: "Not authenticated" };
        }
    }
}