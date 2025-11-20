/**
 * Custom hook for initializing default profile
 */

import { useEffect } from 'react';

interface UseProfileInitializationProps {
    profileCount: number;
    addProfile: (name: string) => void;
}

/**
 * Ensures at least one profile exists on app initialization
 */
export function useProfileInitialization({
    profileCount,
    addProfile,
}: UseProfileInitializationProps): void {
    useEffect(() => {
        if (profileCount === 0) {
            addProfile('Default Profile');
        }
    }, [profileCount, addProfile]);
}
