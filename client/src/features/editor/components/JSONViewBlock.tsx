import JSONTree from 'react-json-tree';
import { JSONViewBlockType } from '../types';

export type JSONViewBlockProps = {
	block: JSONViewBlockType;
};

export function JSONViewBlock({ block: { id, value } }: JSONViewBlockProps): JSX.Element {
	return <JSONTree data={value} />;
}
