export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    serviceVersion: process.env.SERVICE_VERSION || '1.0.0-dev',
    publicAppUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
    cmsAppUrl: process.env.CMS_APP_URL || 'http://localhost:3001',
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001')
      .split(',')
      .map((s) => s.trim()),
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL,
  },
  formsDatabase: {
    url: process.env.FORMS_DATABASE_URL,
    directUrl: process.env.FORMS_DATABASE_DIRECT_URL || process.env.FORMS_DATABASE_URL,
  },
  mongo: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE || 'gec_cms_development',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_min_32_characters_long_12345678',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_min_32_characters_long_87654321',
    accessTtlSeconds: parseInt(process.env.ACCESS_TOKEN_TTL_SECONDS || '900', 10),
    refreshTokenTtlSeconds: parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS || '604800', 10),
    passwordResetTtlSeconds: parseInt(process.env.PASSWORD_RESET_TTL_SECONDS || '3600', 10),
    passwordResetBaseUrl: process.env.PASSWORD_RESET_BASE_URL || 'http://localhost:3001/reset-password',
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    publicBucket: process.env.R2_PUBLIC_BUCKET || 'gec-public-media-dev',
    privateBucket: process.env.R2_PRIVATE_BUCKET || 'gec-private-submissions-dev',
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || 'http://localhost:4000/media-mock',
    uploadUrlTtlSeconds: parseInt(process.env.UPLOAD_URL_TTL_SECONDS || '900', 10),
  },
  revalidation: {
    url: process.env.REVALIDATION_URL || 'http://localhost:3000/api/revalidate',
    hmacSecret: process.env.REVALIDATION_HMAC_SECRET || 'dev_revalidation_hmac_secret_32_chars_long',
    outboxPollIntervalMs: parseInt(process.env.OUTBOX_POLL_INTERVAL_MS || '5000', 10),
  },
  mail: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.MAIL_FROM || 'Galgotias Entrepreneurship Cell <noreply@gec.org>',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    defaultModel: process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash',
    allowedModels: (process.env.GEMINI_ALLOWED_MODELS || 'gemini-2.0-flash,gemini-1.5-pro,gemini-1.5-flash')
      .split(',')
      .map((m) => m.trim()),
  },
  google: {
    clientId: process.env.GOOGLE_WORKSPACE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_WORKSPACE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_WORKSPACE_REFRESH_TOKEN,
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
  },
});
