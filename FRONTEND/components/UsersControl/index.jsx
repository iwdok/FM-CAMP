import { useEffect, useState } from 'react';
import axios from '/utils/rest';

import { Space, Loader, Title, Button, Center, Container, Table } from '@mantine/core';
import { Plus, TrashX, Edit } from 'tabler-icons-react';

import { AddUser } from './addUser';
import { DeleteUser } from './deleteUser';
import { EditUser } from './editUser';

export const UsersControl = () => {
	const [addUserModalOpened, setAddUserModalOpened] = useState(false);
	const [deleteUserModalOpened, setDeleteUserModalOpened] = useState(false);
	const [editUserModalOpened, setEditUserModalOpened] = useState(false);

	const [usersLoading, setUsersLoading] = useState(true);
	const [usersList, setUsersList] = useState([]);
	const [usersListError, setUsersListError] = useState('');

	const [deleteUserId, setDeleteUserId] = useState(-1);
	const [editUserId, setEditUserId] = useState(-1);

	const pushUser = (user) => {
		setUsersList([user, ...usersList]);
	}

	const removeUser = (id) => {
		const delete_index = usersList.findIndex(user => user.id === id);
		if (delete_index !== -1) {
			usersList.splice(delete_index, 1)
			setUsersList(usersList);
		}
	}

	const updateUser = (updatedUser) => {
		const update_index = usersList.findIndex(user => user.id === updatedUser.id);
		if (update_index !== -1) {
			usersList[update_index] = updatedUser;
			setUsersList(usersList);
		}
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
									<Edit
										onClick={() => {
											setEditUserId(user.id);
											setEditUserModalOpened(true);
										}}
										style={{ cursor: 'pointer', color: '#007bff' }}
									/>
									<TrashX
										onClick={() => {
											setDeleteUserId(user.id);
											setDeleteUserModalOpened(true);
										}}
										style={{ cursor: 'pointer', color: '#dc3545' }}
									/>
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
			<DeleteUser opened={deleteUserModalOpened} setOpened={setDeleteUserModalOpened} removeUser={removeUser} deleteUserId={deleteUserId} />
			<EditUser opened={editUserModalOpened} setOpened={setEditUserModalOpened} updateUserList={updateUser} editUserId={editUserId} />
		</Container>
	)
}
