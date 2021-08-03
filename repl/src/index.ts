import dotenv from 'dotenv';
import { getMongo } from './utils/mongo';

dotenv.config();

getMongo().then(() => {
	import('./startServices');
});
