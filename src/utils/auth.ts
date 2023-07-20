import jwtDecode from 'jsonwebtoken';

// Returns the username from jwt token
export function getUsernameFromJWT(token: string): string {
    return jwtDecode.decode(token)['username'];
}
