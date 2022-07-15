import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { sessionOptions } from '/lib/session';
import { withIronSessionSsr } from "iron-session/next";

import axios from '/utils/rest';

import { Text, Container, Space, Card, Group, Center, Button, useMantineTheme, Progress, Title } from '@mantine/core';

export default function Tasks({ course, day, tasks, tasks_ready }) {

	const theme = useMantineTheme();

	const secondaryColor = theme.colorScheme === 'dark'
		? theme.colors.dark[1]
		: theme.colors.gray[7];

	return (
		<>
			<Head>
				<title>Инкубатор талантов</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<Space h="xl" />
				<Card p="lg">
					<Card.Section style={{ position: 'relative' }}>
						{day.image ?
							<Image src={'/' + day.image} width={1200} height={550} alt="Инкубатор талантов" /> :
							course.image ? <Image src={'/' + course.image} width={1200} height={550} alt="Инкубатор талантов" /> :
								<></>
						}
						<Title order={1} weight={700} style={{ position: 'absolute', top: '20px', left: '20px', filter: 'drop-shadow(0px 0px 12px #FFF)', color: '#fd7e14' }}>{day.name}</Title>
						<Text color="orange" size="xl" weight={600} style={{ position: 'absolute', bottom: '15px', left: '20px', zIndex: '10', filter: 'drop-shadow(0px 0px 4px #333)' }}>Прогресс</Text>
					</Card.Section>

					<Progress color="orange" size="lg" value={(tasks_ready / tasks.length) * 100} style={{ zIndex: '12' }} />

					<Text size="sm" weight={500} style={{ color: secondaryColor, lineHeight: 1.5 }}
						dangerouslySetInnerHTML={{ __html: day.description }}>
					</Text>
					<Center>
						<iframe
							width={700}
							height={400}
							src={day.video}
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen>
						</iframe>
					</Center>

					<Space h="lg" />
					{tasks.map(task => {
						return <Card p="lg" key={task.id} style={{ boxShadow: '0 0 12px #999', marginBottom: '20px' }}>
							<Card.Section>
								{task.image && <Image src={'/' + task.image} width={300} height={120} alt="Инкубатор талантов" />}
							</Card.Section>

							<Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
								<Text size="lg" weight={700} color="orange">{task.name}</Text>
							</Group>
							<Link passHref href={`/courses/${course.id}/days/${day.id}/tasks/${task.id}`}>
								<Button color="green" fullWidth style={{ marginTop: 14 }}>
									Открыть задание
								</Button>
							</Link>
						</Card>
					})}
				</Card>
			</Container>
		</>
	)
}

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.cookies['user-cookies']) {
			return {
				redirect: {
					destination: '/auth',
					permanent: false,
				}
			}
		}
		const { day_id } = query
		const response = await axios.get(`/public/days/${day_id}`, {
			headers: {
				Cookie: `user-cookies=${req.cookies['user-cookies']};`
			}
		});
		let course = {};
		let day = {};
		let tasks = [];
		let tasks_ready = 0;
		if (response.status === 200) {
			course = response.data.course;
			day = response.data.day;
			tasks = response.data.tasks;
			tasks_ready = response.data.tasks_ready;
		}
		return {
			props: {
				course: course,
				day: day,
				tasks: tasks,
				tasks_ready: tasks_ready,
				user: req.session.user,
			}
		};
	},
	sessionOptions
);