import {type AuthResult} from 'express-oauth2-jwt-bearer';
import axios from 'axios';

// {
//     "iss": "https://dev-qrziy3kg2izg6egj.us.auth0.com/",
//     "sub": "google-oauth2|118286324596047721516",
//     "aud": [
//       "https://www.bethedisclosure.com/api",
//       "https://dev-qrziy3kg2izg6egj.us.auth0.com/userinfo"
//     ],
//     "iat": 1714589204,
//     "exp": 1714675604,
//     "scope": "openid profile email",
//     "azp": "QkvKpXKmFZ1EVm6gYlSaV5tGlbZuBJ3b"
//   }

export async function getUserInfo(jwtInfo: AuthResult): Promise<Record<string, unknown> | Error> {
	try {
		const token = jwtInfo.token;
		const userInfoUrl = jwtInfo.payload.aud ? jwtInfo.payload.aud[1] : undefined;

		if (!userInfoUrl) {
			throw new Error('missing user info audience in auth jwt, somethings up with auth0');
		}

		const res = await axios.get('https://dev-qrziy3kg2izg6egj.us.auth0.com/userinfo', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log('received user data', res);
		return res.data;
	} catch (error) {
		console.error('auth error', error);
		return error as Error;
	}
}
