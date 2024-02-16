export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.mongodb,
    port: process.env.port || 3002,
    defaultLimit: +process.env.limit || 7,
});