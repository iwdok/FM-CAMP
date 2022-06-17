import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

export const config = {
	api: {
		bodyParser: false,
	},
};

const coursesUsersHandler = async (req, res) => {
	if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
		res.status(403).json({ errorMessage: 'Forbidden' });
		return;
	}
	const { method } = req;
	switch (method) {
		case 'GET':
			console.log(req);
			const users = await database.select('*').from('connected_courses').where({course_id: course_id});
			res.status(200).json(courses);
			break;
		case 'POST':
			
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(coursesUsersHandler, sessionOptions)