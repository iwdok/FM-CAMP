import { useState } from 'react';
import axios from '/utils/rest';
import Head from 'next/head';
import Image from 'next/image';
import styles from './auth.module.scss';

import Logo from '/public/logo.png';

import { Card, Input, InputWrapper, Button, Center, Text } from '@mantine/core';
import { At, Lock } from 'tabler-icons-react';

const Auth = () => {
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [error, setError] = useState('');
	const [authLoading, setAuthLoading] = useState(false);

	const auth = (e) => {
		e.preventDefault();
		setError('');
		setEmailError('');
		setPasswordError('');
		if (e.target.email.value.length === 0){
			setEmailError('Введите электронную почту');
			return;
		}
		if (e.target.password.value.length === 0){
			setPasswordError('Введите пароль');
			return;
		}
		setAuthLoading(true);
		axios.post('/auth', {
			email: e.target.email.value,
			password: e.target.password.value
		}).then(data => {
			console.log(data.status);
			setAuthLoading(false);
		}).catch(error => {
			console.log(error.response.status);
			setAuthLoading(false);
			if (error.response.status === 404) {
				setError('Пользователь не найден');
			} else if (error.response.status === 403) {
				setError('Неверный пароль');
			}
		});
	}

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
				<form onSubmit={auth}>
					<InputWrapper
						label="Электронная почта"
						required
						style={{ marginTop: '20px' }}
						size="md"
						error={emailError}
					>
						<Input
							type="email"
							name="email"
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
							type="password"
							name="password"
							radius="lg"
							size="lg"
							icon={<Lock />}
							placeholder="Ваш пароль"
						/>
					</InputWrapper>
					<Center style={{ marginTop: '50px' }}>
						<Button color="green" size="lg" type="submit" loading={authLoading}>
							Войти
						</Button>
					</Center>
					<Center>
						<Text color="red">
							{error}
						</Text>
					</Center>
				</form>
			</Card>
		</div>
	)
}

export default Auth;