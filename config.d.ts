export interface Config {
    litmus: {
        /**
         * The base url of the litmus instance.
         * @visibility frontend
         */
        baseURL: string;
        /**
         * The api token of the litmus instance.
         * @visibility frontend
         */
        apiToken: string;
    };
}
