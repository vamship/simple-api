import {
    IContext,
    IExtendedProperties,
    IInput,
    RequestHandler
} from '@vamship/expressjs-routes';
import Promise from 'bluebird';
import { default as _childProcess } from 'child_process';

/**
 * Handler that executes a command, and returns the execution results.
 *
 * @param input The input to the handler.
 * @param context The execution context for the handler.
 * @param ext Extended properties for the handler.
 */
const commandHandler: RequestHandler = (
    input: IInput,
    context: IContext,
    ext: IExtendedProperties
) => {
    const { logger } = ext;
    const { command, args } = input;
    const commandStr = `${command} ${args.join(' ')}`;

    logger.trace('Executing command', { command: commandStr });
    return new Promise((resolve, reject) => {
        _childProcess.exec(commandStr, (error, stdout, stderr) => {
            if (error) {
                logger.warn('Error executing command', { error });
            } else {
                logger.info('Command execution successful');
            }
            resolve({
                command: commandStr,
                success: !error,
                output: error ? stderr : stdout,
                error: error ? error : undefined
            });
        });
    });
};

export default commandHandler;
