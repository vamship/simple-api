import _chai from 'chai';
import _chaiAsPromised from 'chai-as-promised';
import 'mocha';
import _rewire from 'rewire';
import _sinonChai from 'sinon-chai';

_chai.use(_chaiAsPromised);
_chai.use(_sinonChai);
const expect = _chai.expect;

import { ObjectMock, testValues as _testValues } from '@vamship/test-utils';

const LOG_METHODS = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
    'child'
];

const _commandHandlerModule = _rewire('../../../src/handlers/command-handler');
const commandHandler = _commandHandlerModule.default;

describe('commandHandler()', () => {
    function _createInput(command?: string, args?: string[]) {
        command = command || _testValues.getString('command');
        args = args || [
            _testValues.getString('arg1'),
            _testValues.getString('arg2')
        ];
        return {
            command,
            args
        };
    }

    let _childProcessMock;
    let _ext;

    beforeEach(() => {
        _childProcessMock = new ObjectMock().addMock('exec');
        _commandHandlerModule.__set__('child_process_1', {
            default: _childProcessMock.instance
        });

        const logger = LOG_METHODS.reduce((mock, method) => {
            mock.addMock(method);
            return mock;
        }, new ObjectMock()).instance;

        _ext = {
            logger
        };
    });

    it('should return a promise when invoked', () => {
        const input = _createInput();
        const ret = commandHandler(input, {}, _ext);

        expect(ret).to.be.an('object');
        expect(ret.then).to.be.a('function');
    });

    it('should execute the specified command by executing a child process', () => {
        const command = _testValues.getString('command');
        const args = [
            _testValues.getString('arg1'),
            _testValues.getString('arg2'),
            _testValues.getString('arg3')
        ];
        const input = _createInput(command, args);

        const execMethod = _childProcessMock.mocks.exec;

        expect(execMethod.stub).to.not.have.been.called;
        commandHandler(input, {}, _ext);

        expect(execMethod.stub).to.have.been.calledOnce;
        const [commandStr, callback] = execMethod.stub.args[0];
        const expectedCommandStr = `${command} ${args.join(' ')}`;
        expect(commandStr).to.equal(expectedCommandStr);
        expect(callback).to.be.a('function');
    });

    it('should resolve the promise with an error if execution results in an error', () => {
        const message = 'something went wrong!';
        const command = _testValues.getString('command');
        const args = [
            _testValues.getString('arg1'),
            _testValues.getString('arg2'),
            _testValues.getString('arg3')
        ];
        const input = _createInput(command, args);

        const expectedCommandStr = `${command} ${args.join(' ')}`;

        const execMethod = _childProcessMock.mocks.exec;
        const ret = commandHandler(input, {}, _ext);

        const [, callback] = execMethod.stub.args[0];
        const stderr = _testValues.getString('stderr');

        callback(message, undefined, stderr);

        return expect(ret).to.be.fulfilled.then((result) => {
            expect(result).to.be.an('object');
            expect(result.success).to.be.false;
            expect(result.command).to.equal(expectedCommandStr);
            expect(result.error).to.equal(message);
            expect(result.output).to.equal(stderr);
        });
    });

    it('should resolve the promise with success if execution succeeds', () => {
        const command = _testValues.getString('command');
        const args = [
            _testValues.getString('arg1'),
            _testValues.getString('arg2'),
            _testValues.getString('arg3')
        ];
        const input = _createInput(command, args);

        const expectedCommandStr = `${command} ${args.join(' ')}`;

        const execMethod = _childProcessMock.mocks.exec;
        const ret = commandHandler(input, {}, _ext);

        const [, callback] = execMethod.stub.args[0];
        const stdout = _testValues.getString('stdout');

        callback(null, stdout);

        return expect(ret).to.be.fulfilled.then((result) => {
            expect(result).to.be.an('object');
            expect(result.success).to.be.true;
            expect(result.command).to.equal(expectedCommandStr);
            expect(result.error).to.be.undefined;
            expect(result.output).to.equal(stdout);
        });
    });
});
