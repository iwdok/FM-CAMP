import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainChatHandler = async (req, res) => {
	const { method } = req;
	const { task_id } = req.query
	switch (method) {
		case 'GET':
			const user = await database.select('*').from('users').where({email: req.session.user.email}).limit(1);
			const chat = await database.select('*').from('task_messages').where({task_id: task_id, user_id: user[0].id});
			res.status(200).json(chat);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainChatHandler, sessionOptions)