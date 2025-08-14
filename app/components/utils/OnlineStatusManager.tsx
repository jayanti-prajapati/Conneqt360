import React, { useEffect, useState } from "react";


import { useAppStateOnlineStatus } from "@/hooks/useAppStateOnlineStatus";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import useUsersStore from "@/store/useUsersStore";

interface Props {
    userData: any;
}

const OnlineStatusManager: React.FC<Props> = ({ userData }) => {
    const [appActive, setAppActive] = useState(false);
    const { updateUser } = useUsersStore();
    // const [networkAvailable, setNetworkAvailable] = useState(false);

    useAppStateOnlineStatus(setAppActive);
    const isConnceted = useNetworkStatus(false);

    useEffect(() => {
        console.log('appActive', appActive);
        console.log('isConnceted', isConnceted);
        const isOnline = appActive && isConnceted || false;
        // userData(isOnline); // Send update to API/store
        console.log('isOnline', isOnline);
        updateUser(userData?._id, { isOnline });
    }, [appActive, isConnceted, userData]);

    return null; // No UI, just background tracking
};

export default OnlineStatusManager;
