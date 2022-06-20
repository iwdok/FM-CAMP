import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.scss';

import Logo from '/public/logo.png';

import { Button, Grid } from '@mantine/core';

export const Header = ({ user }) => {
	return (
		<Grid className={styles.header}>
			<Grid.Col span={8} className={styles.menu} justify="center">
				<Link href="/" passHref>
					<Image src={Logo} alt="Инкубатор талантов" width={150} height={45} />
				</Link>
				<Link href="/">
					Курсы
				</Link>
				{/* <Link href="/courses">
					Курсы
				</Link> */}
			</Grid.Col>
			<Grid.Col span={4} align="right">
				{
					(user && user.email) ?
						(
							<Link href="/account" passHref>
								<Button variant="light">Личный кабинет</Button>
							</Link>
						)
						:
						(
							<Link href="/auth" passHref>
								<Button variant="light">Войти</Button>
							</Link>
						)
				}
			</Grid.Col>
		</Grid>
	)
}
