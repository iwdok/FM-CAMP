import { useEffect, useState } from 'react';

import { Modal, InputWrapper, Input, Textarea, Group, Text, Space, Button, useMantineTheme, Center, LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, Photo, Check, Error404 } from 'tabler-icons-react';
import axios from '/utils/rest';

export const EditCourse = ({ opened, setOpened, updateCoursesList, editCourseId }) => {
	const [loading, setLoading] = useState(false);

	const [editError, setEditError] = useState('');

	const [nameError, setNameError] = useState('');

	const [image, setImage] = useState('');
	const [createObjectURL, setCreateObjectURL] = useState(null);

	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);

	const theme = useMantineTheme();

	useEffect(() => {
		if (opened) {
			axios.get('/users')
				.then(res => {
					setUsers(res.data);
				})
				.catch(error => {
					console.log(error);
				})
				.finally(() => {

				})
		}
	}, [opened]);


	useEffect(() => {
		if (editCourseId !== -1) {
			setLoading(true);
			axios.get(`/user/${editCourseId}`)
				.then(res => {
					if (res.status === 200) {
						console.log(res.data);
						setEmailDefaultValue(res.data.email);
						setNameDefaultValue(res.data.name);
						setSurnameDefaultValue(res.data.surname);
						setAgeDefaultValue(res.data.age);
						setPasswordDefaultValue(res.data.password);
						res.data.status === 'user' ? setStatusDefaultValue('Ученик') : setStatusDefaultValue('Администратор');
						setLoading(false);
					}
				})
				.catch(error => {
					if (error.response.status === '404') {
						showNotification({
							title: 'Пользователь не найден',
							autoClose: 3500,
							color: 'red',
							icon: <Error404 size={18} />,
						});
					} else {
						showNotification({
							title: 'Ошибка поулчения пользователя',
							autoClose: 3500,
							color: 'red',
							icon: <Error404 size={18} />,
						});
					}
					setOpened(false);
				})
				.finally(() => {

				})
		}
		console.log('REQ')
	}, [editCourseId, setOpened])

	const getIconColor = (status, theme) => {
		return status.accepted
			? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
			: status.rejected
				? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
				: theme.colorScheme === 'dark'
					? theme.colors.dark[0]
					: theme.colors.gray[7];
	}

	const ImageUploadIcon = ({
		status,
		...props
	}) => {
		if (status.accepted) {
			return <Upload {...props} />;
		}

		if (status.rejected) {
			return <X {...props} />;
		}

		return <Photo {...props} />;
	}

	const dropzoneChildren = (status, theme) => (
		<Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
			{createObjectURL ? <img src={createObjectURL} width={100} /> :
				<ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />}
			<div>
				<Text size="xl" inline>
					Переместите фото сюда
				</Text>
				<Text size="sm" color="dimmed" inline mt={7}>
					Файл размером не более 5 мегабайт
				</Text>
			</div>
		</Group>
	);

	const saveCourse = (e) => {
		e.preventDefault();
		setNameError('');
		setEditError('');
		if (e.target.name.value === '') {
			setNameError('Введите название курса');
			return;
		}

		if (image === '') {
			setEditError('Выберите изображение');
			return;
		}

		setLoading(true);

		const body = new FormData();
		body.append("name", e.target.name.value);
		body.append("description", e.target.description.value);
		body.append("image", image, `course_${e.target.name.value}.${image.path.split('.')[image.path.split('.').length - 1]}`);
		axios.post('/courses', body)
			.then(res => {
				if (res.status === 200) {
					pushCourse(res.data);
					showNotification({
						title: 'Курс изменен',
						autoClose: 3500,
						color: 'green',
						icon: <Check size={18} />,
					});
				} else {
					setAddError('Ошибка изменения курса, попробуйте позже');
				}
			})
			.catch(error => {
				console.log(error)
				if (error.response.status === 409) {
					setAddError('Такое название курса уже занято');
				} else {
					setAddError('Ошибка изменения курса, попробуйте позже');
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Редактировать курс"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<form onSubmit={saveCourse}>
				<LoadingOverlay visible={loading} />
				<InputWrapper required label="Название курса" description="Название курса в свободной форме, будет отображаться в качесвте заголовка" error={nameError}>
					<Input type="text" name="name" />
				</InputWrapper>
				<InputWrapper label="Описание курса" description="Описание курса в свободной форме, необязательно" error={nameError}>
					<Textarea type="text" name="description" />
				</InputWrapper>
				<Space h="md" />
				<Dropzone
					onDrop={(files) => {
						setImage(files[0]);
						setCreateObjectURL(URL.createObjectURL(files[0]));
					}}
					onReject={() => {
						showNotification({
							title: 'Файл отклонен',
							autoClose: 3500,
							color: 'red',
							icon: <X size={18} />,
						});
					}}
					maxSize={3 * 1024 ** 2}
					accept={IMAGE_MIME_TYPE}
					padding="xs"
				>
					{(status) => dropzoneChildren(status, theme)}
				</Dropzone>
				<Space h="md" />
				<Center>
					<Button
						color="green"
						type="submit"
						style={{ marginRight: '20px' }}
					>
						Добавить
					</Button>
					<Button
						variant="light"
						color="dark"
						onClick={() => { setOpened(false) }}
					>
						Отменить
					</Button>
				</Center>
				<Center>
					<Text color="red">{editError}</Text>
				</Center>
			</form>
		</Modal>
	)
}
