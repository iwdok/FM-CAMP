import { useState } from 'react';
import axios from '/utils/rest';
import Head from 'next/head';
import Image from 'next/image';

import useUser from '/lib/useUser.js';
import { MyAccount } from '/components/MyAccount';
import { CoursesControl } from '/components/CoursesControl';
import { UsersControl } from '/components/UsersControl';

import { Container, Title, Tabs, Input, InputWrapper, Button, Center, Text } from '@mantine/core';
import { ListCheck, Users, ListDetails, User, Settings } from 'tabler-icons-react';

const EditCourse = () => {
	const { user } = useUser({
		redirectTo: '/auth'
	})

	return (
		<div>
			<Head>
				<title>Изменить курс - Инкубатор талантов</title>
				<meta name="description" content="Инкубатор талантов" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Container size="md" px="md" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
				<Title order={2}>Редактивароние курса</Title>
				<Tabs color="orange" orientation="vertical">
					<Tabs.Tab label="Настройки" icon={<Settings size={14} />}>
						настрой
					</Tabs.Tab>
					<Tabs.Tab label="Управление днями" icon={<User size={14} />}>
						<MyAccount user={user} />
					</Tabs.Tab>
					<Tabs.Tab label="Управление пользователями" icon={<Users size={14} />}>
						<UsersControl />
					</Tabs.Tab>
				</Tabs>
			</Container>
		</div>
	)
}

export default EditCourse;