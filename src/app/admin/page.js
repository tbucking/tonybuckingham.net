'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Flex, Text } from 'theme-ui';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
	const router = useRouter();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSignOut = async () => {
		setErrorMessage('');
		setIsSigningOut(true);

		try {
			const supabase = createClient();
			const { error } = await supabase.auth.signOut();

			if (error) {
				setErrorMessage(error.message);
				setIsSigningOut(false);
				return;
			}

			router.replace('/login');
			router.refresh();
		} catch {
			setErrorMessage('Sign out failed. Please try again.');
			setIsSigningOut(false);
		}
	};

	return (
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
			<Text as="p" sx={{ mb: 3 }}>
				Authenticated admin content goes here.
			</Text>
			<Flex sx={{ alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
				<Button onClick={handleSignOut} disabled={isSigningOut}>
					{isSigningOut ? 'Signing out...' : 'Log out'}
				</Button>
				{errorMessage && (
					<Text as="p" sx={{ color: 'error' }}>
						{errorMessage}
					</Text>
				)}
			</Flex>
		</Box>
	);
}
