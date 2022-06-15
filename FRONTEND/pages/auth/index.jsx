import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from './auth.module.scss';

import Logo from '/public/logo.png';

import { Card, Input, InputWrapper, Button, Center } from '@mantine/core';
import { At, Lock } from 'tabler-icons-react';

export default function Auth() {
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	return (
		<div className={styles.container}>
			<Head>
				<title>Войти - Инкубатор талантов</title>
				<meta name="description" content="Инкубатор талантов" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Card shadow="0 0 50px #00000044" p="xl" radius="xl" className={styles.authContainer}>
				<Card.Section>
					<Image src={Logo} height={450} alt="Инкубатор талантов" />
				</Card.Section>
				<form>
					<InputWrapper
						label="Электронная почта"
						required
						style={{ marginTop: '20px' }}
						size="md"
						error={emailError}
					>
						<Input
							radius="lg"
							size="lg"
							icon={<At />}
							placeholder="Ваша электронная почта"
						/>
					</InputWrapper>
					<InputWrapper
						label="Пароль"
						required
						style={{ marginTop: '20px' }}
						size="md"
						error={passwordError}
					>
						<Input
							radius="lg"
							size="lg"
							icon={<Lock />}
							placeholder="Ваш пароль"
						/>
					</InputWrapper>
					<Center style={{ marginTop: '50px' }}>
						<Button color="green" size="lg">
							Войти
						</Button>
					</Center>
				</form>
			</Card>
		</div>
	)
}
