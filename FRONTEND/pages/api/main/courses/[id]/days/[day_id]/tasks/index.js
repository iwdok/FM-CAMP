import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainTasksHandler = async (req, res) => {
	const { method } = req;
	const { day_id } = req.query
	switch (method) {
		case 'GET':
			const tasks = await database.select('*').from('tasks').where({day_id: day_id });
			res.status(200).json(tasks);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainTasksHandler, sessionOptions)