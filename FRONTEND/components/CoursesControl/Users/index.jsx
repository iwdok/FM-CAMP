import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '/utils/rest';

import { Space, Loader, Title, Button, Center, Container, Table } from '@mantine/core';
import { Plus, TrashX, Edit } from 'tabler-icons-react';

import { AddCourse } from './addCourse';
import { DeleteCourse } from './deleteCourse';
// import { EditCourse } from './editCourse';

export const CourseUsersControl = ({ course_id }) => {
	const [addCourseModalOpened, setAddCourseModalOpened] = useState(false);

	const [coursesLoading, setCoursesLoading] = useState(true);
	const [coursesList, setCoursesList] = useState([]);
	const [coursesListError, setCoursesListError] = useState('');

	useEffect(() => {
		axios.get(`/courses/${course_id}/users`)
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
						<th>Описание</th>
						<th>Количество участников</th>
					</tr>
				</thead>
				<tbody>
					{!coursesLoading && coursesList.map(course => {
						return <tr key={course.id}>
							<td>{course.name}</td>
							<td>{course.description}</td>
							<td>{0}</td>
							<td>
								<Center>
									<Link href={`/courses/edit/${course.id}`} passHref>
										<Edit style={{ cursor: 'pointer', color: '#007bff' }} />
									</Link>
									<TrashX style={{ cursor: 'pointer', color: '#dc3545' }} />
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
			<DeleteCourse opened={deleteCourseModalOpened} setOpened={setDeleteCourseModalOpened} removeCourse={removeCourse} />
			{/* <EditCourse opened={editCourseModalOpened} setOpened={setEditCourseModalOpened} updateCourseList={updateCourse} /> */}
		</Container>
	)
}
