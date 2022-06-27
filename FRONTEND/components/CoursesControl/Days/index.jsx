import { useEffect, useState } from 'react';

import { Modal, Stack, Space, Button, useMantineTheme, Center, Table } from '@mantine/core';
import { Plus, TrashX, Edit, List, Loader } from 'tabler-icons-react';
import axios from '/utils/rest';

import { AddDay } from './addDay';
import { DeleteDay } from './deleteDay';
import { Tasks } from './Tasks';

export const Days = ({ opened, setOpened, courseId }) => {
	const [addDayModalOpened, setAddDayModalOpened] = useState(false);
	const [deleteDayModalOpened, setDeleteDayModalOpened] = useState(false);
	const [editDayModalOpened, setEditDayModalOpened] = useState(false);
	const [tasksModalOpened, setTasksModalOpened] = useState(false);

	const [deleteDayId, setDeleteDayId] = useState(-1);
	const [editDayId, setEditDayId] = useState(-1);

	const [tasksId, setTasksId] = useState(-1);

	const [daysLoading, setDaysLoading] = useState(false);
	const [daysListError, setDaysListError] = useState(false);

	const [daysList, setDaysList] = useState([]);

	const theme = useMantineTheme();

	useEffect(() => {
		if (courseId !== -1) {
			setDaysList([]);
			setDaysLoading(true);
			axios.get(`/courses/${courseId}/days`)
				.then(res => {
					setDaysList(res.data);
				})
				.catch(error => {
					setDaysListError('Ошибка получения списка курсов')
				})
				.finally(() => {
					setDaysLoading(false);
				});
		}
	}, [courseId]);

	const pushDay = (day) => {
		setDaysList([...daysList, day]);
	}

	const removeDay = (id) => {
		const delete_index = daysList.findIndex(day => day.id === id);
		if (delete_index !== -1) {
			daysList.splice(delete_index, 1)
			setDaysList(daysList);
		}
	}

	const updateDay = (updatedDay) => {
		const update_index = daysList.findIndex(day => day.id === updatedDay.id);
		if (update_index !== -1) {
			daysList[update_index] = updatedDay;
			setDaysList(daysList);
		}
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Список дней"
			size="xl"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<Button
				leftIcon={<Plus />}
				variant="light"
				color="green"
				onClick={() => setAddDayModalOpened(true)}
			>
				Добавить день
			</Button>
			<Space h="sm" />
			<Table verticalSpacing="sm" striped highlightOnHover>
				<thead>
					<tr>
						<th>Название</th>
						{/* <th>Описание</th> */}
						<th>Изображение</th>
						<th>Видео</th>
						<th>Количесво заданий</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{!daysLoading && daysList.map(day => {
						return <tr key={day.id}>
							<td>{day.name}</td>
							{/* <td>{course.description || 'Нет описания' }</td> */}
							<td>{day.image ? 'Есть' : 'Нет'}</td>
							<td>{day.video ? 'Есть' : 'Нет'}</td>
							<td>{day.connected_tasks}</td>
							<td>
								<Stack>
									<Button
										variant="outline"
										color="orange"
										leftIcon={<List />}
										onClick={() => {
											setTasksId(day.id);
											setTasksModalOpened(true);
										}}
									>
										Задания
									</Button>
									<Button
										variant="outline"
										color="blue"
										leftIcon={<Edit />}
										onClick={() => {
											setEditDayId(day.id);
											setEditDayModalOpened(true);
										}}
									>
										Редактировать
									</Button>
									<Button
										variant="outline"
										color="red"
										leftIcon={<TrashX />}
										onClick={() => {
											setDeleteDayId(day.id);
											setDeleteDayModalOpened(true);
										}}
									>
										Удалить
									</Button>
								</Stack>
							</td>
						</tr>
					})}
				</tbody>
			</Table>
			{daysLoading && <Center><Loader color="orange" variant="bars" /></Center>}
			{(!daysLoading && daysList.length === 0) && <Center>Список дней пуст</Center>}
			<Center>
				{daysListError}
			</Center>
			<AddDay opened={addDayModalOpened} setOpened={setAddDayModalOpened} pushDay={pushDay} courseId={courseId} />
			<DeleteDay opened={deleteDayModalOpened} setOpened={setDeleteDayModalOpened} removeDay={removeDay} courseId={courseId} deleteDayId={deleteDayId} />
			<Tasks opened={tasksModalOpened} setOpened={setTasksModalOpened} courseId={courseId} dayId={tasksId} />
		</Modal>
	)
}
