// utils/dateUtils.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatTimestamp = (isoString: string) => {
    return dayjs(isoString).fromNow();
};