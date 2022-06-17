import { useEffect, useState } from 'react';
import axios from '/utils/rest';

import { Space, Loader, Title, Button, Center, Container, Table } from '@mantine/core';
import { Plus, TrashX, Edit } from 'tabler-icons-react';

import { AddUser } from './addUser';

export const UsersControl = () => {
	const [addUserModalOpened, setAddUserModalOpened] = useState(false);

	const [usersLoading, setUsersLoading] = useState(true);
	const [usersList, setUsersList] = useState([]);
	const [usersListError, setUsersListError] = useState('');

	const pushUser = (user) => {
		setUsersList([user, ...usersList]);
	}

	useEffect(() => {
		axios.get('/users')
			.then(res => {
				setUsersList(res.data);
			})
			.catch(error => {
				setUsersListError('Ошибка получения пользователей')
			})
			.finally(() => {
				setUsersLoading(false);
			});
	}, [])

	return (
		<Container style={{ width: '100%' }}>
			<Title order={2}>
				Управление пользователями
			</Title>
			<Space h="xl" />
			<Button
				leftIcon={<Plus />}
				variant="light"
				color="green"
				onClick={() => setAddUserModalOpened(true)}
			>
				Добавить пользователя
			</Button>
			<Space h="xl" />
			<Title order={3} style={{ fontWeight: 400 }}>
				Существующие пользователи
			</Title>
			<Table verticalSpacing="sm" striped highlightOnHover>
				<thead>
					<tr>
						<th>Электронная почта</th>
						<th>Имя</th>
						<th>Фамилия</th>
						<th>Возраст</th>
						<th>Пароль</th>
						<th>Статус</th>
						<th>Управление</th>
					</tr>
				</thead>
				<tbody>
					{!usersLoading && usersList.map(user => {
						return <tr key={user.id}>
							<td>{user.email}</td>
							<td>{user.name}</td>
							<td>{user.surname}</td>
							<td>{user.age}</td>
							<td>{user.password}</td>
							<td>{user.status === 'user' ? 'Ученик' : 'Администратор'}</td>
							<td>
								<Center>
									<Edit style={{ cursor: 'pointer', color: '#007bff' }} />
									<TrashX style={{ cursor: 'pointer', color: '#dc3545' }} />
								</Center>
							</td>
						</tr>
					})}
				</tbody>
			</Table>
			{usersLoading && <Center><Loader color="orange" variant="bars" /></Center>}
			{(!usersLoading && usersList.length === 0) && <Center>Список пользователей пуст</Center>}
			<Center>
				{usersListError}
			</Center>
			<AddUser opened={addUserModalOpened} setOpened={setAddUserModalOpened} pushUser={pushUser} />
		</Container>
	)
}
