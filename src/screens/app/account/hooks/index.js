import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../../services/contexts/AuthContext';

export function useHooks() {
    const [loading, setLoading] = useState(false);
    const { signOut } = useAuth();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await signOut();
                            // The AuthContext will automatically update the user state
                            // and the Navigation component will re-render to show auth screens
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                            console.error('Logout error:', error);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return {
        loading,
        handleLogout
    };
}