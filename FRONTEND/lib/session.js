export const sessionOptions = {
	password: process.env.SECRET_COOKIE_PASSWORD,
	cookieName: '',
	// secure: true,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
}
