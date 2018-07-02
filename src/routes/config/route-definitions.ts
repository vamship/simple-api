import configProvider from '@vamship/config';
import { IRouteDefinition } from '@vamship/expressjs-routes';

const config = configProvider.getConfig();

const routeDefinitions: IRouteDefinition[] = [
    {
        method: 'GET',
        path: '/:key',
        handler: (input) => ({ value: config.get(input.key) }),
        inputMapper: {
            key: 'params.key'
        },
        schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            description: 'Schema for get config value',
            properties: {
                key: { type: 'string', minLength: 1 }
            },
            required: ['key']
        }
    }
];

export default routeDefinitions;
