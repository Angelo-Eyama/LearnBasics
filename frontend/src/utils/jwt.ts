import { jwtDecode } from 'jwt-decode';

interface UserPayload {
    id?: string;
    email?: string;
    name?: string;
    // Add any other expected payload properties here
    [key: string]: any;
}

export const extractUserFromToken = (token: string): UserPayload => {
    try {
        const payload = jwtDecode<UserPayload>(token);
        return payload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return {};
    }
};