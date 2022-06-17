import { useState } from 'react';

import { Modal, InputWrapper, Input, Textarea, Group, Text, Space, Button, useMantineTheme } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Upload, X, Photo } from 'tabler-icons-react';
import axios from '/utils/rest';

export const AddCourse = ({ opened, setOpened }) => {
	const [nameError, setNameError] = useState('');
	const [descriptionError, setDescriptionError] = useState('');
	const [image, setImage] = useState('');

	const theme = useMantineTheme();

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
		console.log(status);
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
			<ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
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
		const body = new FormData();
		body.append("name", e.target.name.value);
		body.append("description", e.target.description.value);
		body.append("image", image, 'chris.jpg');
		axios.post('/courses', body)
			.then(res => {
				console.log(res)
			})
			.catch(error => {
				console.log(error)
			})
			.finally(() => {

			});
	}

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Добавить курс"
			size="lg"
			transition="fade"
			transitionDuration={300}
			transitionTimingFunction="ease"
		>
			<form onSubmit={saveCourse}>
				<InputWrapper required label="Название курса" description="Название курса в свободной форме, будет отображаться в качесвте заголовка" error={nameError}>
					<Input type="text" name="name" />
				</InputWrapper>
				<InputWrapper label="Описание курса" description="Описание курса в свободной форме, необязательно" error={nameError}>
					<Textarea type="text" name="description" />
				</InputWrapper>
				<Space h="md" />
				<Dropzone
					onDrop={(files) => {
						setImage(files[0])
					}}
					onReject={(files) => console.log('rejected files', files)}
					maxSize={3 * 1024 ** 2}
					accept={IMAGE_MIME_TYPE}
					padding="xs"
				>
					{(status) => dropzoneChildren(status, theme)}
				</Dropzone>
				<Space h="md" />
				<Button
					variant="light"
					color="green"
					type="submit"
				>
					Добавить
				</Button>
			</form>
		</Modal>
	)
}
