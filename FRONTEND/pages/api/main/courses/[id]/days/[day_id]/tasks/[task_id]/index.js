import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainTaskHandler = async (req, res) => {
	const { method } = req;
	const { task_id } = req.query
	switch (method) {
		case 'GET':
			const tasks = await database.select('*').from('tasks').where({id: task_id });
			const user = await database.select('*').from('users').where({email: req.session.user.email}).limit(1);
			const accepted = await database.select('*').from('accepted_tasks').where({task_id: task_id, user_id: user[0].id});
			if (accepted.length > 0){
				tasks[0].accepted = true;
				tasks[0].status = accepted[0].status;
			} else {
				tasks[0].accepted = false;
			}
			res.status(200).json(tasks[0]);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainTaskHandler, sessionOptions)