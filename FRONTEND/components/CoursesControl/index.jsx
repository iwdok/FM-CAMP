import { useState } from 'react';
import styles from './coursesControl.module.scss';

import { Space, Loader, Title, Button, Center, Container } from '@mantine/core';
import { Plus } from 'tabler-icons-react';

export const CoursesControl = () => {
	const [coursesLoading, setCoursesLoading] = useState(true);
	const [coursesList, setCoursesList] = useState([]);

	return (
		<Container style={{width: '100%'}}>
			<Title order={2}>
				Управление курсами
			</Title>
			<Space h="xl" />
			<Button
				leftIcon={<Plus />}
				variant="light"
				color="green"
			>
				Добавить курс
			</Button>
			<Space h="xl" />
			<Title order={3} style={{ fontWeight: 400 }}>
				Существующие курсы
			</Title>
			{coursesLoading && <Center><Loader color="orange" variant="bars" /></Center>}
			{(!coursesLoading && coursesList.map(el => {
				<div>Курс</div>
			}))}
		</Container>
	)
}
