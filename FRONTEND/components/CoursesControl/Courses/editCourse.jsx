import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Modal, InputWrapper, Input, Group, Text, Space, Button, useMantineTheme, Center, LoadingOverlay, MultiSelect } from '@mantine/core';
import RichTextEditor from '/components/RichText';
import { nanoid } from 'nanoid';
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, Photo, Check, Error404 } from 'tabler-icons-react';
import axios from '/utils/rest';

export const EditCourse = ({ opened, setOpened, updateCoursesList, editCourseId }) => {
	const [loading, setLoading] = useState(false);

	const [editError, setEditError] = useState('');
	const [nameError, setNameError] = useState('');

	const [nameDefaultValue, setNameDefaultValue] = useState('');

	const [description, setDescription] = useState('');
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
			setDescription('');
			setSelectedUsers([]);
			setLoading(true);
			axios.get(`/courses/${editCourseId}`)
				.then(res => {
					if (res.status === 200) {
						setNameDefaultValue(res.data.name);
						console.log('description set')
						setDescription(res.data.description);
						setImage(res.data.image);
						axios.get(`/courses/${editCourseId}/users`)
							.then(res => {
								if (res.status === 200) {
									setSelectedUsers(res.data);
								} else {
									setEditError('Ошибка редактирования курса, попробуйте позже');
								}
							})
							.catch(error => {
								console.log(error);
								if (error.response.status === 410) {
									setEditError('Курс не найден, попробуйте позже');
								}
							})
							.finally(() => {
								setLoading(false);
							})
					} else {
						setEditError('Ошибка редактирования курса, попробуйте позже');
					}
				})
				.catch(error => {
					console.log(error)
					if (error.response.status === '404') {
						showNotification({
							title: 'Курс не найден',
							autoClose: 3500,
							color: 'red',
							icon: <Error404 size={18} />,
						});
					} else {
						showNotification({
							title: 'Ошибка получения курса',
							autoClose: 3500,
							color: 'red',
							icon: <Error404 size={18} />,
						});
					}
					setOpened(false);
				})
				.finally(() => {
					setLoading(false);
				})
		}
	}, [editCourseId, setOpened, setSelectedUsers])

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
			{image ? <Image src={createObjectURL ? createObjectURL : '/' + image} width={100} height={70} alt="Изображение курса" /> :
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
		body.append("description", description);
		if (image && image.path) {
			body.append("image", image, `course_${nanoid()}`);
		}
		axios.put(`/courses/${editCourseId}`, body)
			.then(res => {
				if (res.status === 200) {
					console.log(updateCoursesList);
					updateCoursesList(res.data.course);
					showNotification({
						title: 'Курс изменен',
						autoClose: 3500,
						color: 'green',
						icon: <Check size={18} />,
					});
				} else {
					setEditError('Ошибка изменения курса, попробуйте позже');
				}
			})
			.catch(error => {
				console.log(error)
				if (error.response.status === 409) {
					setEditError('Такое название курса уже занято');
				} else {
					setEditError('Ошибка изменения курса, попробуйте позже');
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return (
		<Modal
			opened={opened}
			onClose={() => { setOpened(false) }}
			title="Редактировать курс"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			{description.length > 0 && <form onSubmit={saveCourse}>
				<LoadingOverlay visible={loading} />
				<InputWrapper required label="Название курса" description="Название курса в свободной форме, будет отображаться в качесвте заголовка" error={nameError}>
					<Input type="text" name="name" value={nameDefaultValue} onChange={e => setNameDefaultValue(e.currentTarget.value)} />
				</InputWrapper>
				<Space h="md" />
				<RichTextEditor
					name="description"
					value={description}
					onChange={value => {
						setDescription(value);
					}}
					controls={
						[
							['bold', 'italic', 'underline', 'link'],
							['unorderedList', 'orderedList'],
							['h1', 'h2', 'h3'],
							['sup', 'sub'],
							['alignLeft', 'alignCenter', 'alignRight'],
						]
					}
					style={{ height: '400px', overflow: 'auto' }}
				/>
				<Space h="md" />
				<MultiSelect
					value={selectedUsers}
					onChange={selected => setSelectedUsers(selected)}
					data={users.map(el => el.email)}
					label="Выберите пользователей, которые должны попасть на курс"
					placeholder="Пользователей не выбрано"
					searchable
					nothingFound="Пользователей не найдено"
				/>
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
						onClick={() => { saveCourse }}
					>
						Сохранить
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
			</form>}
		</Modal>
	)
}
