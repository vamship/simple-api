import { IRouteDefinition } from '@vamship/expressjs-routes';
import commandHandler from '../../handlers/command-handler';

const routeDefinitions: IRouteDefinition[] = [
    {
        method: 'POST',
        path: '/',
        handler: commandHandler,
        inputMapper: {
            command: 'body.command',
            args: 'body.args'
        },
        schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            description: 'Schema for get config value',
            properties: {
                command: { type: 'string', minLength: 1 },
                args: { type: 'array', items: { type: 'string' } }
            },
            required: ['command', 'args']
        }
    }
];

export default routeDefinitions;
