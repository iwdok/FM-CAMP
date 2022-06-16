import database from '/utils/database';

const authHandler = async (req, res) => {
	const {
		body: { email, password },
		method,
	} = req;
	console.log(req.query);
	console.log(req.body);
	console.log(email, password);
	switch (method) {
		case 'POST':
			const user = await database.select('*').from('users').where({email: email}).limit(1);
			if (user.length === 1){
				res.status(200).json(user[0]);
			} else {
				res.status(404).json({errorMessage: 'Пользователь не найден'});
			}
			console.log(user);
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default authHandler;