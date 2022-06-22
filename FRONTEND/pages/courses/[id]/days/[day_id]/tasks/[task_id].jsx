import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Image from 'next/image'
import { nanoid } from 'nanoid'

import { sessionOptions } from '/lib/session';
import { withIronSessionSsr } from "iron-session/next";

import axios from '/utils/rest';
import { Dropzone } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';


import { Input, Text, Container, Space, Card, Group, Button, useMantineTheme, Grid, Center, Title } from '@mantine/core';
import { Send, File, Upload, X, Check } from 'tabler-icons-react';

export default function Task({ task, day, course, task_status, messages }) {
	const router = useRouter();
	const { id, day_id, task_id } = router.query;
	const [chat, setChat] = useState(messages);
	const [acceptLoading, setAcceptLoading] = useState(false);

	const [files, setFiles] = useState([]);

	const theme = useMantineTheme();

	const secondaryColor = theme.colorScheme === 'dark'
		? theme.colors.dark[1]
		: theme.colors.gray[7];

	const setAccepted = (status) => {
		setAcceptLoading(true);
		axios.post(`/main/courses/${id}/days/${day_id}/tasks/${task_id}/accept`)
			.then(res => {
				router.replace(router.asPath);
			})
			.catch(error => {

			})
			.finally(() => {
				
			})
	}

	const getIconColor = (status, theme) => {
		return status.accepted
			? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
			: status.rejected
				? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
				: theme.colorScheme === 'dark'
					? theme.colors.dark[0]
					: theme.colors.gray[7];
	}

	const FileUploadIcon = ({
		status,
		...props
	}) => {
		if (status.accepted) {
			return <Upload {...props} />;
		}

		if (status.rejected) {
			return <X {...props} />;
		}

		return <File {...props} />;
	}

	const dropzoneChildren = (status, theme) => (
		<Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
			<FileUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
			<div>
				<Text size="xl" inline>
					Переместите файлы сюда
				</Text>
				<Text size="sm" color="dimmed" inline mt={7}>
					Файл размером не более 5 мегабайт
				</Text>
			</div>
		</Group>
	);

	const sendMessage = (e) => {
		e.preventDefault();
		const body = new FormData();
		body.append('message', e.target.message.value);
		if (files) {
			for (let index in files) {
				console.log(files[index].path);
				body.append(`file_${index}`, files[index], `task_${nanoid()}.${files[index].path.split('.')[files[index].path.split('.').length - 1]}`);
			}
		}
		axios.post(`/main/courses/${id}/days/${day_id}/tasks/${task_id}/answer`, body)
			.then(res => {
				e.target.reset();
				showNotification({
					title: 'Сообщение отправлено',
					message: 'Скоро эксперты проверят выполнение задания и дадут вам ответ',
					autoClose: 3500,
					color: 'green',
					icon: <Check size={18} />,
				});
				setFiles([]);
				setChat([...chat, res.data]);
			})
			.catch(error => {

			})
			.finally(() => {

			})
	}

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
						{task.image ?
							<Image src={'/' + task.image} width={1200} height={550} alt="Инкубатор талантов" /> :
							day.image ? <Image src={'/' + day.image} width={1200} height={550} alt="Инкубатор талантов" /> :
								course.image ? <Image src={'/' + course.image} width={1200} height={550} alt="Инкубатор талантов" /> :
									<></>
						}
						<Title order={1} weight={700} style={{ position: 'absolute', top: '20px', left: '20px', filter: 'drop-shadow(0px 0px 12px #FFF)', color: '#fd7e14' }}>{task.name}</Title>
						<Text color="orange" size="xl" weight={600} style={{ position: 'absolute', bottom: '15px', left: '20px', zIndex: '10', filter: 'drop-shadow(0px 0px 4px #333)' }}>Статус задания</Text>
					</Card.Section>
					<Space h="sm" />
					{task_status === 'waiting'
						?
						<Text size="lg" weight={700} color="orange">
							Ожидаем вашего ответа
						</Text>
						:
						task_status === 'ready' ?
							<Text size="lg" weight={700} color="green">
								Задание выполнено, поздравляем!
							</Text>
							:
							<Text size="lg" weight={700} color="blue">
								Начните выполнение!
							</Text>
					}
					<Text size="sm" weight={500} style={{ color: secondaryColor, lineHeight: 1.5 }}
						dangerouslySetInnerHTML={{ __html: task.description }}>
					</Text>

					<Space h="lg" />
					{task_status !== 'empty'
						?
						<>
							<Text weight={500} color="blue">
								В файлах ниже содержатся материалы для работы, скачайте их все и изучите
							</Text>
							<Space h="sm" />
							{task.files.map((file, index) => {
								return <Text key={file} variant="link" component="a" href={`/${file}`}>
									Скачать файл {index + 1}
								</Text>
							})}
							<Space h="md" />
							<Text color="orange" weight={500} size="lg">
								Общение с экспертом
							</Text>

							<div style={{ width: '100%', minHeight: '100px', backgroundColor: '#eee', border: '2px solid #ddd', borderRadius: '15px', padding: '20px' }}>
								{chat.map(message => {
									return <div style={{ backgroundColor: message.answer_id ? '#37c8b855' : '#f7670755', borderRadius: '15px', width: '70%', marginTop: '5px', padding: '5px' }} key={message.id}>
										<Text size="sm">{message.answer_id ? 'Эксперт' : 'Вы'}:</Text>
										<Text size="md" weight={500}>{message.message}</Text>
										{message.files.map((file, index) => {
											return <>
												<Text key={file} variant="link" component="a" size="sm" href={`/${file}`}>
													Скачать файл {index + 1}
												</Text>
												<Space h="sm" />
											</>
										})}
									</div>
								})}
							</div>
							{task_status !== 'ready' &&
								<div>
									<form onSubmit={(e) => sendMessage(e)} >
										<Grid >
											<Grid.Col span={10}>
												<Input type="text" placeholder="Введите ваше сообщение" name="message" />
											</Grid.Col>
											<Grid.Col span={2}>
												<Button variant="light" color="blue" type="submit" rightIcon={<Send />}>Отправить</Button>
											</Grid.Col>
										</Grid>
										<Space h="sm" />
										{files.length > 0 && <>
											<Text size="sm">Прикрепленные файлы: {files.map(el => {
												return ` ${el.name},`
											})}</Text>
										</>}
										<Dropzone
											onDrop={(files) => {
												setFiles(files);
											}}
											onReject={() => {
												showNotification({
													title: 'Файл отклонен',
													autoClose: 3500,
													color: 'red',
													icon: <X size={18} />,
												});
											}}
											maxSize={3 * 4024 ** 2}
											padding="xs"
										>
											{(status) => dropzoneChildren(status, theme)}
										</Dropzone>
									</form>
								</div>}
							{task_status === 'ready' && <Center><Text color="green" size="xl" weight={700}>Вы выполнили заданее, можете приступать к выполнению следующих</Text></Center>}
						</>
						:
						<Button loading={acceptLoading} color="green" onClick={() => setAccepted(true)}>Приступить к выполнению</Button>}

				</Card>
			</Container >
		</>
	)
}

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		const { task_id } = query;
		const response = await axios.get(`/public/tasks/${task_id}`, {
			headers: {
				Cookie: `user-cookies=${req.cookies['user-cookies']};`
			}
		});
		let course = {};
		let day = {};
		let task = [];
		let task_status = 'empty';
		let messages = [];
		if (response.status === 200) {
			course = response.data.course;
			day = response.data.day;
			task = response.data.task;
			task_status = response.data.task_status;
			messages = response.data.messages;
		}
		return {
			props: {
				course: course,
				day: day,
				task: task,
				task_status: task_status,
				messages: messages,
				user: req.session.user,
			}
		};
	},
	sessionOptions
);