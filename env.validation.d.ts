declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DB_PORT: number;
    DB_HOST: string;
    DB_USERNAME: string;
    PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
