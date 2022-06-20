import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';
import formidable from "formidable";
import saveFile from "/utils/saveFile";

import database from '/utils/database';

export const config = {
	api: {
		bodyParser: false,
	},
};

const daysHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'GET':
			const days = await database.select('*').from('days').where({ course_id: id });
			const connected_tasks = await database.select('id').from('tasks').whereIn('day_id', days.map(el => el.id));
			res.status(200).json(days.map(day => {
				return {
					id: day.id,
					name: day.name,
					description: day.desciption,
					image: day.image,
					video: day.video,
					tasks: connected_tasks.filter(el => el.day_id === day.id).length,
				}
			}));
			break;
		case 'POST':
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.status(500).json({ errorMessage: 'Error' });
					return;
				}
				const exists_days = await database.select('*').from('days').where({ name: fields.name, course_id: id }).limit(1);
				if (exists_days.length > 0) {
					res.status(409).json({ errorMessage: 'Day exists' });
					return;
				}
				let path;
				if (files.image) {
					path = saveFile(files.image);
				}
				const new_id = await database('days')
					.returning('id')
					.insert({
						name: fields.name,
						description: fields.description,
						image: path || null,
						video: fields.video,
						course_id: id
					});
				res.status(200).json({
					id: new_id[0].id,
					name: fields.name,
					description: fields.description,
					image: path || null,
					video: fields.video
				});
			});
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(daysHandler, sessionOptions)