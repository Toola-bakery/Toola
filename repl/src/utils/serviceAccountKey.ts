export default {
	type: 'service_account',
	project_id: 'toolspace-d6f56',
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: 'firebase-adminsdk-235h4@toolspace-d6f56.iam.gserviceaccount.com',
	client_id: '106637621867445651359',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-235h4%40toolspace-d6f56.iam.gserviceaccount.com',
};
