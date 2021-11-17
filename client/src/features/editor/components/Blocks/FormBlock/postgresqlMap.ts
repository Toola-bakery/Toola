import { installedBlocks } from '../../Block/BlockSelector';

type Mapping = keyof typeof installedBlocks | ({ [key: string]: any } & { type: keyof typeof installedBlocks });
export const postgresqlMap: {
	[key: string]: Mapping[] | Mapping;
} = {
	bigint: 'numericInput',
	// 	bigserial	:"",
	// 	bit :'',
	// 	bit varying [ (n) ]	varbit [ (n) ]	variable-length bit string
	// 	boolean	bool	logical Boolean (true/false)
	// 	box	 	rectangular box on a plane
	// 	bytea	 	binary data ("byte array")
	// character [ (n) ]	char [ (n) ]	fixed-length character string
	'character varying': ['textArea', 'textInput'],
	// cidr	 	IPv4 or IPv6 network address
	// circle	 	circle on a plane
	// date	 	calendar date (year, month, day)
	// double precision	float8	double precision floating-point number (8 bytes)
	// inet	 	IPv4 or IPv6 host address
	// integer	int, int4	signed four-byte integer
	// interval [ fields ] [ (p) ]	 	time span
	// json	 	textual JSON data
	// jsonb	 	binary JSON data, decomposed
	// line	 	infinite line on a plane
	// lseg	 	line segment on a plane
	// macaddr	 	MAC (Media Access Control) address
	// money	 	currency amount
	// numeric [ (p, s) ]	decimal [ (p, s) ]	exact numeric of selectable precision
	// path	 	geometric path on a plane
	// pg_lsn	 	PostgreSQL Log Sequence Number
	// point	 	geometric point on a plane
	// polygon	 	closed geometric path on a plane
	// real	float4	single precision floating-point number (4 bytes)
	smallint: ['numericInput'],
	// smallserial	serial2	autoincrementing two-byte integer
	// serial	serial4	autoincrementing four-byte integer
	text: ['textArea', 'textInput'],
	// time [ (p) ] [ without time zone ]	 	time of day (no time zone)
	// time [ (p) ] with time zone	timetz	time of day, including time zone
	// timestamp [ (p) ] [ without time zone ]	 	date and time (no time zone)
	// timestamp [ (p) ] with time zone	timestamptz	date and time, including time zone
	// tsquery	 	text search query
	// tsvector	 	text search document
	// txid_snapshot	 	user-level transaction ID snapshot
	// uuid	 	universally unique identifier
	// xml
};
