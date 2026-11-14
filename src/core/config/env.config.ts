import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
    
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z
    .string({ error: 'DATABASE_URL is not set' })
    .regex(
      /^postgres(ql)?:\/\//,
      'DATABASE_URL must start with postgresql:// or postgres://',
    ),

  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:4200')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),

  FACE_RECOGNITION_API_URL: z
    .string()
    .url()
    .default('http://localhost:5000/recognize-base64'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    `Invalid environment variables:
${z.prettifyError(parsed.error)}`,
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof schema>;
