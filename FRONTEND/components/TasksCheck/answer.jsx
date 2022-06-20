import { useEffect, useState } from 'react';

import { Modal, InputWrapper, Input, Group, Text, Space, Button, useMantineTheme, Center, NativeSelect, Grid } from '@mantine/core';
import { nanoid } from 'nanoid';
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, File, Check, Send } from 'tabler-icons-react';
import axios from '/utils/rest';

export const Answer = ({ opened, setOpened, taskId, userId }) => {

	const theme = useMantineTheme();

	const [chatLoading, setChatLoading] = useState(false);
	const [chat, setChat] = useState([]);

	const [files, setFiles] = useState([]);

	useEffect(() => {
		if (taskId, userId) {
			axios.get(`/to_check/${taskId}/${userId}/chat`)
				.then(res => {
					if (res.status === 200) {
						setChat(res.data);
					} else {
						setChatError('Ошибка получения чата, пожалуйста, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error);
					setChatError('Ошибка получения чата, пожалуйста, попробуйте позже');
				})
				.finally(() => {
					setChatLoading(false);
				})
		}
	}, [taskId, userId]);

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
		body.append('user_id', userId.toString());
		body.append('status', e.target.status.value === 'Исправить' ? 'waiting' : 'ready');
		if (files) {
			for (let index in files) {
				console.log(files[index].path);
				body.append(`file_${index}`, files[index], `task_${nanoid()}.${files[index].path.split('.')[files[index].path.split('.').length - 1]}`);
			}
		}
		axios.post(`/to_check/${taskId}/answer`, body)
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
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Ответить"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			{!chatLoading && <Text color="orange" weight={500} size="lg">
				Общение с учеником
			</Text>}
			{!chatLoading && <>
				<div style={{ width: '100%', minHeight: '100px', backgroundColor: '#eee', border: '2px solid #ddd', borderRadius: '15px', padding: '20px' }}>
					{chat.map(message => {
						return <div style={{ backgroundColor: message.answer_id ? '#37c8b855' : '#f7670755', borderRadius: '15px', width: '70%', marginTop: '5px', padding: '5px' }} key={message.id}>
							<Text size="sm">{message.answer_id ? 'Вы' : 'Ученик'}:</Text>
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
						<NativeSelect
							data={['Сделано', 'Исправить']}
							placeholder="Выберите вариант"
							label="Выберите статус задания"
							required
							name="status"
						/>
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
				</div>
			</>}
		</Modal>
	)
}
