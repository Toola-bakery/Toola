import firebaseAdmin from 'firebase-admin';

import serviceAccount from './serviceAccountKey';

firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(serviceAccount as any),
});
