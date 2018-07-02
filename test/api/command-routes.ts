import _chai from 'chai';
import _chaiAsPromised from 'chai-as-promised';
import _chaiHttp from 'chai-http';
import 'mocha';
import _sinonChai from 'sinon-chai';

_chai.use(_chaiAsPromised);
_chai.use(_sinonChai);
_chai.use(_chaiHttp);
const { expect, request } = _chai;

import { testValues as _testValues } from '@vamship/test-utils';
import Promise from 'bluebird';
import {
    endpoint,
    getRouteBuilder as _getRouteBuilder
} from '../utils/api-utils';

describe('[/command routes]', () => {
    const _buildRoute = _getRouteBuilder('/command');

    describe('GET /command', () => {
        it('should return a schema validation error if the command is invalid', () => {
            const inputs = _testValues.allButString('');
            const path = _buildRoute();
            return Promise.map(inputs, (command) => {
                return request(endpoint)
                    .post(path)
                    .type('json')
                    .send({
                        command
                    })
                    .then((res) => {
                        expect(res.status).to.equal(400);
                        expect(res.header['content-type']).to.match(
                            /^application\/json/
                        );
                        const { error } = res.body;
                        expect(error).to.match(/.*\[SchemaError\].*command.*/);
                    });
            });
        });

        it('should return a schema validation error if the args are invalid', () => {
            const inputs = _testValues.allButArray();
            const path = _buildRoute();
            return Promise.map(inputs, (args) => {
                const command = _testValues.getString('command');

                return request(endpoint)
                    .post(path)
                    .type('json')
                    .send({
                        command,
                        args
                    })
                    .then((res) => {
                        expect(res.status).to.equal(400);
                        expect(res.header['content-type']).to.match(
                            /^application\/json/
                        );
                        const { error } = res.body;
                        expect(error).to.match(/.*\[SchemaError\].*args.*/);
                    });
            });
        });

        it('should return an error response if the command execution results in an error', () => {
            const path = _buildRoute();
            const badCommand = _testValues.getString('badCommand');
            const args = [
                _testValues.getString('arg1'),
                _testValues.getString('arg2'),
                _testValues.getString('arg3'),
                _testValues.getString('arg4')
            ];

            const expectedCommandStr = `${badCommand} ${args.join(' ')}`;

            return request(endpoint)
                .post(path)
                .type('json')
                .send({
                    command: badCommand,
                    args
                })
                .then((res) => {
                    expect(res.status).to.equal(200);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    const { success, error, output, command } = res.body;

                    expect(success).to.be.false;
                    expect(command).to.equal(expectedCommandStr);
                    expect(output).to.match(/.*command not found.*/);
                    expect(error).to.be.an('object');
                });
        });

        it('should return a success response if the command execution succeeds', () => {
            const path = _buildRoute();
            const goodCommand = 'echo';
            const args = [
                _testValues.getString('arg1'),
                _testValues.getString('arg2'),
                _testValues.getString('arg3'),
                _testValues.getString('arg4')
            ];

            const expectedCommandStr = `${goodCommand} ${args.join(' ')}`;

            return request(endpoint)
                .post(path)
                .type('json')
                .send({
                    command: goodCommand,
                    args
                })
                .then((res) => {
                    expect(res.status).to.equal(200);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    const { success, error, output, command } = res.body;

                    expect(success).to.be.true;
                    expect(command).to.equal(expectedCommandStr);
                    expect(output).to.match(new RegExp(args.join(' ')));
                    expect(error).to.be.undefined;
                });
        });
    });
});
