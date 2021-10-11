import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

dayjs.extend(relativeTime);

export function Dayjs({
	time,
	format = 'DD MMM YYYY [at] HH:mm',
	timeAgo = false,
}: {
	time: string | Date;
	format?: string;
	timeAgo?: boolean;
}) {
	const dayjsInstance = useMemo(() => dayjs(time), [time]);
	const string = useMemo(() => dayjsInstance.format(format), [format, dayjsInstance]);

	if (timeAgo) return <span>{dayjsInstance.toNow(true)} ago</span>;
	return <span>{string}</span>;
}
