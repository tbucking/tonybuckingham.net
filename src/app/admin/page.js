'use client';

import { Box, Text } from 'theme-ui';
import { Auth } from '../auth';

export default function AdminPage() {
	return (
		<Auth>
			<Box
				as="main"
				sx={{
					bg: 'muted',
					color: 'text',
					p: 4,
					borderRadius: 8,
					maxWidth: 640,
					width: '100%'
				}}
			>
				<Text as="h1" sx={{ mb: 2, fontSize: 4 }}>
					Admin
				</Text>
				<Text as="p">Authenticated admin content goes here.</Text>
			</Box>
		</Auth>
	);
}
