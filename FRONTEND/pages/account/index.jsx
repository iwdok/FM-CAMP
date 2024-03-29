import Head from 'next/head';
import styles from './account.module.scss';

import useUser from '/lib/useUser.js';
import { MyAccount } from '/components/MyAccount';
import { CoursesControl } from '/components/CoursesControl/Courses';
import { UsersControl } from '/components/UsersControl';
import { TasksCheck } from '/components/TasksCheck';

import { Container, Tabs } from '@mantine/core';
import { ListCheck, Users, ListDetails, User, Settings, Checks } from 'tabler-icons-react';

const Account = () => {
	const { user } = useUser({
		redirectTo: '/auth'
	})

	return (
		<div className={styles.container}>
			<Head>
				<title>Личный кабинет - Инкубатор талантов</title>
				<meta name="description" content="Инкубатор талантов" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Container size="md" px="md" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
				{(user && user.status === 'admin') && (
					<>
						<Tabs color="orange" orientation="vertical">
							<Tabs.Tab label="Мои курсы" icon={<ListCheck size={14} />}>Gallery tab content</Tabs.Tab>
							<Tabs.Tab label="Мой аккаунт" icon={<User size={14} />}>
								<MyAccount user={user} />
							</Tabs.Tab>
							<Tabs.Tab label="Проверка заданий" icon={<Checks size={14} />}>
								<TasksCheck />
							</Tabs.Tab>
							<Tabs.Tab label="Управление пользователями" icon={<Users size={14} />}>
								<UsersControl />
							</Tabs.Tab>
							<Tabs.Tab label="Управление курсами" icon={<ListDetails size={14} />}>
								<CoursesControl />
							</Tabs.Tab>
							<Tabs.Tab label="Настройки" icon={<Settings size={14} />}>Settings tab content</Tabs.Tab>
						</Tabs>
					</>
				)}
				{(user && user.status === 'user') && (
					<>
						<Tabs color="orange" orientation="vertical">
							<Tabs.Tab label="Мои курсы" icon={<ListCheck size={14} />}>Gallery tab content</Tabs.Tab>
							<Tabs.Tab label="Мой аккаунт" icon={<User size={14} />}><MyAccount user={user} /></Tabs.Tab>
						</Tabs>
					</>
				)}
			</Container>
		</div>
	)
}

export default Account;