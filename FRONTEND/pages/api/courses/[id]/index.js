import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const courseHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	const exists_course = await database.select('*').from('courses').where({ id: id }).limit(1);
	if (exists_course.length <= 0) {
		res.status(410).json({ errorMessage: 'Course not exists' });
		return;
	}
	switch (method) {
		case 'GET':
			res.status(200).json(exists_course[0]);
			break;
		case 'PUT':
			if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
				res.status(403).json({ errorMessage: 'Forbidden' });
				break;
			}
			const { body: { name, description, image } } = req;
			const check_new_name = await database.select('*').from('courses').where({name: name}).limit(1);
			if (check_new_name.length > 0){
				res.status(409).json({ errorMessage: 'Course exists'});
				break;
			}
			const updated_user = await database('users')
				.returning(['id', 'email', 'name', 'surname', 'age', 'password', 'status'])
				.update({
					email: email,
					name: name,
					surname: surname,
					age: age,
					password: password,
					status: status
				})
				.where({ id: id });
			res.status(200).json({
				user: updated_user[0]
			})
			break;
		case 'DELETE':
			if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
				res.status(403).json({ errorMessage: 'Forbidden' });
				break;
			}
			const deleted_course = await database('courses').returning('id').del().where({ id: id });
			res.status(200).json({
				id: deleted_course[0].id
			})
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(courseHandler, sessionOptions)