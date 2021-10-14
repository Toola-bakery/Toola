import { Button, Checkbox, FormGroup, H3, InputGroup, NumericInput, TextArea } from '@blueprintjs/core';
import { useState } from 'react';
import { useForm } from '../../features/form/hooks/useForm';
import { useMutateResource } from '../../features/resources/hooks/useMutateResource';

export function AddPostgresqlResource() {
	const [isConnectionString, setIsConnectionString] = useState(true);

	const form = useForm({
		connectionString: { type: 'input' },
		name: { type: 'input' },
		host: { type: 'input' },
		port: { type: 'input' },
		dbName: { type: 'input' },
		username: { type: 'input' },
		password: { type: 'input' },
		clientKey: { type: 'input' },
		clientCert: { type: 'input' },
		CA: { type: 'input' },
		ssl: { type: 'input' },
	});

	const mutation = useMutateResource();

	return (
		<div style={{ padding: 30, flex: 1, maxWidth: 600 }}>
			<H3>Configure PostgreSQL</H3>
			<FormGroup label="Database label" inline>
				<InputGroup
					placeholder="Production database (readonly)"
					value={form.name.value as string}
					onChange={form.name.onChange}
				/>
			</FormGroup>

			<div style={{ display: 'flex', flex: 1, justifyContent: 'right' }}>
				<Button
					minimal
					intent="primary"
					text={isConnectionString ? 'Fill in connection fields individually' : 'Use a database connection string'}
					onClick={() => {
						setIsConnectionString(!isConnectionString);
						form.set({});
					}}
					style={{ marginBottom: 15, fontWeight: 600 }}
				/>
			</div>

			{isConnectionString ? (
				<FormGroup label="Connection string" inline>
					<InputGroup value={form.connectionString.value as string} onChange={form.connectionString.onChange} />
				</FormGroup>
			) : (
				<>
					<FormGroup label="Host" inline>
						<InputGroup value={form.host.value as string} onChange={form.host.onChange} />
					</FormGroup>

					<FormGroup label="Port" inline>
						<NumericInput
							allowNumericCharactersOnly
							buttonPosition="none"
							fill
							value={form.port.value as number}
							onValueChange={(value) => form.port.setValue(value)}
							placeholder="5432"
						/>
					</FormGroup>
					<FormGroup label="Name" inline>
						<InputGroup value={form.dbName.value as string} onChange={form.dbName.onChange} />
					</FormGroup>
					<FormGroup label="Username" inline>
						<InputGroup value={form.username.value as string} onChange={form.username.onChange} />
					</FormGroup>
					<FormGroup label="Password" inline>
						<InputGroup value={form.password.value as string} onChange={form.password.onChange} />
					</FormGroup>
				</>
			)}

			<FormGroup label=" " inline>
				<Checkbox
					label="SSL"
					checked={form.ssl.value as boolean}
					onChange={(event) => form.ssl.setValue((event.target as HTMLInputElement).checked)}
				/>
			</FormGroup>
			{form.ssl.value ? (
				<>
					<FormGroup label="CA" inline>
						<TextArea fill style={{ resize: 'vertical' }} value={form.CA.value as string} onChange={form.CA.onChange} />
					</FormGroup>
					<FormGroup label="Client Cert" inline>
						<TextArea
							fill
							style={{ resize: 'vertical' }}
							value={form.clientCert.value as string}
							onChange={form.clientCert.onChange}
						/>
					</FormGroup>
					<FormGroup label="Client Key" inline>
						<TextArea
							fill
							style={{ resize: 'vertical' }}
							value={form.clientKey.value as string}
							onChange={form.clientKey.onChange}
						/>
					</FormGroup>
				</>
			) : null}

			<div style={{ display: 'flex', justifyContent: 'right' }}>
				<Button style={{ marginRight: 8 }} minimal intent="primary" text="Test connection" />
				<Button
					intent="primary"
					onClick={() => mutation.mutate({ ...form.values, type: 'postgresql' })}
					loading={mutation.isLoading}
					text="Create resource"
				/>
			</div>
		</div>
	);
}
