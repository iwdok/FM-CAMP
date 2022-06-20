import { useState, useEffect } from 'react';
import axios from '/utils/rest';

import { Space, Loader, Title, Button, Center, Container, Table } from '@mantine/core';
import { Plus, TrashX, Edit, ListNumbers } from 'tabler-icons-react';

import { AddCourse } from './addCourse';
import { DeleteCourse } from './deleteCourse';
import { EditCourse } from './editCourse';
import { Days } from './Days';

export const CoursesControl = () => {
	const [addCourseModalOpened, setAddCourseModalOpened] = useState(false);
	const [deleteCourseModalOpened, setDeleteCourseModalOpened] = useState(false);
	const [editCourseModalOpened, setEditCourseModalOpened] = useState(false);
	const [daysModalOpened, setDaysModalOpened] = useState(false);

	const [deleteCourseId, setDeleteCourseId] = useState(-1);
	const [editCourseId, setEditCourseId] = useState(-1);
	const [courseId, setCourseId] = useState(-1);

	const [coursesLoading, setCoursesLoading] = useState(true);
	const [coursesList, setCoursesList] = useState([]);
	const [coursesListError, setCoursesListError] = useState('');

	useEffect(() => {
		axios.get('/courses')
			.then(res => {
				setCoursesList(res.data);
			})
			.catch(error => {
				setCoursesListError('Ошибка получения списка курсов')
			})
			.finally(() => {
				setCoursesLoading(false);
			});
	}, []);

	const pushCourse = (course) => {
		setCoursesList([course, ...coursesList]);
	}

	const removeCourse = (id) => {
		const delete_index = coursesList.findIndex(course => course.id === id);
		if (delete_index !== -1) {
			coursesList.splice(delete_index, 1)
			setCoursesList(coursesList);
		}
	}

	const updateCourse = (updatedCourse) => {
		const update_index = coursesList.findIndex(course => course.id === updatedCourse.id);
		if (update_index !== -1) {
			coursesList[update_index] = updatedCourse;
			setCoursesList(coursesList);
		}
	}

	return (
		<Container style={{ width: '100%' }}>
			<Title order={2}>
				Управление курсами
			</Title>
			<Space h="xl" />
			<Button
				leftIcon={<Plus />}
				variant="light"
				color="green"
				onClick={() => setAddCourseModalOpened(true)}
			>
				Добавить курс
			</Button>
			<Space h="xl" />
			<Title order={3} style={{ fontWeight: 400 }}>
				Существующие курсы
			</Title>
			<Table verticalSpacing="sm" striped highlightOnHover>
				<thead>
					<tr>
						<th>Название</th>
						{/* <th>Описание</th> */}
						<th>Количество дней</th>
						<th>Количество участников</th>
					</tr>
				</thead>
				<tbody>
					{!coursesLoading && coursesList.map(course => {
						return <tr key={course.id}>
							<td>{course.name}</td>
							{/* <td>{course.description || 'Нет описания' }</td> */}
							<td>{course.days}</td>
							<td>{course.selected_users}</td>
							<td>
								<Center>
									<ListNumbers
										style={{ cursor: 'pointer', color: '#28a745' }}
										onClick={() => {
											setCourseId(course.id);
											setDaysModalOpened(true);
										}}
									/>
									<Edit
										style={{ cursor: 'pointer', color: '#007bff' }}
										onClick={() => {
											setEditCourseId(course.id);
											setEditCourseModalOpened(true);
										}}
									/>
									<TrashX
										style={{ cursor: 'pointer', color: '#dc3545' }}
										onClick={() => {
											setDeleteCourseId(course.id);
											setDeleteCourseModalOpened(true);
										}}
									/>
								</Center>
							</td>
						</tr>
					})}
				</tbody>
			</Table>
			{coursesLoading && <Center><Loader color="orange" variant="bars" /></Center>}
			{(!coursesLoading && coursesList.length === 0) && <Center>Список курсов пуст</Center>}
			<Center>
				{coursesListError}
			</Center>
			<AddCourse opened={addCourseModalOpened} setOpened={setAddCourseModalOpened} pushCourse={pushCourse} />
			<DeleteCourse opened={deleteCourseModalOpened} setOpened={setDeleteCourseModalOpened} removeCourse={removeCourse} deleteCourseId={deleteCourseId} />
			<EditCourse opened={editCourseModalOpened} setOpened={setEditCourseModalOpened} updateCourseList={updateCourse} editCourseId={editCourseId} />
			<Days opened={daysModalOpened} setOpened={setDaysModalOpened} updateCourseList={updateCourse} courseId={courseId} />
		</Container>
	)
}
