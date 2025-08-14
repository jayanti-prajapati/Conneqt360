import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppStateOnlineStatus = (
    onStatusChange: (isOnline: boolean) => void
) => {
    // Use a ref to track the current state
    const appStateRef = useRef(AppState.currentState);
    const callbackRef = useRef(onStatusChange);

    // Update the callback ref if it changes
    useEffect(() => {
        callbackRef.current = onStatusChange;
    }, [onStatusChange]);

    useEffect(() => {
        console.log('Setting up app state listener...');

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            // console.log('Raw AppState event received:', nextAppState);

            // Always update the ref with the new state
            // const r = appStateRef.current;
            appStateRef.current = nextAppState;

            const isActive = nextAppState === 'active';
            // console.log('App state changed from', prevState, 'to', nextAppState, '| isActive:', isActive);

            // Call the callback with the new state
            if (typeof callbackRef.current === 'function') {
                // console.log('Calling callback with isActive:', isActive);
                callbackRef.current(isActive);
            } else {
                console.warn('Callback is not a function');
            }
        };

        // Check initial state immediately
        const initialState = AppState.currentState;
        // console.log('Initial app state:', initialState);

        // Set initial state
        appStateRef.current = initialState;

        // Call the callback with initial state
        if (typeof callbackRef.current === 'function') {
            const isActive = initialState === 'active';
            // console.log('Calling initial callback with isActive:', isActive);
            callbackRef.current(isActive);
        }

        // Listen for future state changes
        // console.log('Adding app state change listener...');
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        // console.log('App state listener added');

        // For debugging: Log when the component unmounts
        const componentWillUnmount = () => {
            // console.log('Cleaning up app state listener...');
            if (subscription?.remove) {
                subscription.remove();
                // console.log('App state listener removed');
            } else {
                console.warn('Could not remove app state listener: subscription.remove is not a function');
            }
        };

        return componentWillUnmount;
    }, []); // Empty dependency array means this effect runs once on mount
};
