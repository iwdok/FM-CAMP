import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainCoursesOneHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'GET':
			const courses = await database.select('*').from('courses').where({id: id});
			const user = await database.select('*').from('users').where({email: req.session.user.email}).limit(1);
			const availableCourses = await database.select(['id', 'course_id']).from('connected_courses').where({user_id: user[0].id});
			res.status(200).json(courses.filter(course => {
				if (availableCourses.find(el => el.course_id === course.id)){
					return true;
				} else {
					return false;
				}
			}));
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainCoursesOneHandler, sessionOptions)