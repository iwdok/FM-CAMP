import { useState, useEffect } from 'react';
import axios from '/utils/rest';

import { Space, Loader, Title, Button, Center, Container, Table } from '@mantine/core';
import { MessageCircle } from 'tabler-icons-react';

import { Answer } from './answer';

export const TasksCheck = () => {
	const [answerModalOpened, setAnswerModalOpened] = useState(false);

	const [task, setTask] = useState(-1);

	const [tasksLoading, setTasksLoading] = useState(true);
	const [tasksList, setTasksList] = useState([]);
	const [tasksListError, setTasksListError] = useState('');

	useEffect(() => {
		axios.get('/to_check')
			.then(res => {
				setTasksList(res.data);
			})
			.catch(error => {
				setTasksListError('Ошибка получения списка курсов')
			})
			.finally(() => {
				setTasksLoading(false);
			});
	}, []);

	return (
		<Container style={{ width: '100%' }}>
			<Title order={2}>
				Проверка заданий
			</Title>
			<Space h="xl" />
			<Table verticalSpacing="sm" striped highlightOnHover>
				<thead>
					<tr>
						<th>День</th>
						<th>Задание</th>
						<th>Талант</th>
						<th>Email таланта</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{!tasksLoading && tasksList.map(task => {
						return <tr key={task.task.id}>
							<td>{task.day.name}</td>
							<td>{task.task.name}</td>
							<td>{`${task.user.name} ${task.user.surname}`}</td>
							<td>{task.user.email}</td>
							<td>
								<Center>
									<Button
										variant="outline"
										color="orange"
										leftIcon={<MessageCircle />}
										onClick={() => {
											setTask(task);
											setAnswerModalOpened(true);
										}}
									>
										Ответить
									</Button>
								</Center>
							</td>
						</tr>
					})}
				</tbody>
			</Table>
			{tasksLoading && <Center><Loader color="orange" variant="bars" /></Center>}
			{(!tasksLoading && tasksList.length === 0) && <Center>Список заданий для проверки пуст</Center>}
			<Center>
				{tasksListError}
			</Center>
			<Answer opened={answerModalOpened} setOpened={setAnswerModalOpened} task={task} />
		</Container>
	)
}
