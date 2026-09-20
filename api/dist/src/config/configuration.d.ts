declare const _default: () => {
    app: {
        nodeEnv: string;
        port: number;
        serviceVersion: string;
        publicAppUrl: string;
        cmsAppUrl: string;
        corsOrigins: string[];
        logLevel: string;
    };
    database: {
        url: string;
        directUrl: string;
    };
    formsDatabase: {
        url: string;
        directUrl: string;
    };
    mongo: {
        uri: string;
        database: string;
    };
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessTtlSeconds: number;
        refreshTokenTtlSeconds: number;
        passwordResetTtlSeconds: number;
        passwordResetBaseUrl: string;
    };
    r2: {
        accountId: string;
        endpoint: string;
        accessKeyId: string;
        secretAccessKey: string;
        publicBucket: string;
        privateBucket: string;
        publicBaseUrl: string;
        uploadUrlTtlSeconds: number;
    };
    revalidation: {
        url: string;
        hmacSecret: string;
        outboxPollIntervalMs: number;
    };
    mail: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
    gemini: {
        apiKey: string;
        defaultModel: string;
        allowedModels: string[];
    };
    google: {
        clientId: string;
        clientSecret: string;
        refreshToken: string;
        driveFolderId: string;
    };
};
export default _default;
