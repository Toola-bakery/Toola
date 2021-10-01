import { useMutation } from 'react-query';
import { Config } from '../../../config';
import { useKy } from '../../../hooks/useKy';

export function useMutateResource() {
	const ky = useKy();
	return useMutation((database: any) => {
		return ky.post(`${Config.domain}/databases/post`, { json: { database } }).json();
	});
}
