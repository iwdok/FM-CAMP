import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainDayHandler = async (req, res) => {
	const { method } = req;
	const { day_id } = req.query
	switch (method) {
		case 'GET':
			const days = await database.select('*').from('days').where({id: day_id});
			res.status(200).json(days[0]);
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainDayHandler, sessionOptions)