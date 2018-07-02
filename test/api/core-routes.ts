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
import {
    endpoint,
    getRouteBuilder as _getRouteBuilder
} from '../utils/api-utils';

describe('[core routes]', () => {
    const _buildRoute = _getRouteBuilder('/__test__');

    describe('[Bad Requests]', () => {
        it('should return a 400 if the handler throws a BadRequestError', () => {
            const path = _buildRoute('error/badrequest');
            return request(endpoint)
                .get(path)
                .then((res) => {
                    expect(res.status).to.equal(400);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    expect(res.body).to.deep.equal({
                        error:
                            '[BadRequestError] Incorrect or malformed request'
                    });
                    expect(res.error).to.exist;
                });
        });

        it('should return a 400 if the handler throws a SchemaError', () => {
            const path = _buildRoute('error/schema');
            return request(endpoint)
                .get(path)
                .then((res) => {
                    expect(res.status).to.equal(400);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    expect(res.body).to.deep.equal({
                        error:
                            '[BadRequestError] [SchemaError] Schema validation failed'
                    });
                    expect(res.error).to.exist;
                });
        });
    });

    describe('[Unauthorized Requests]', () => {
        it('should return a 401 if the handler throws an UnauthorizedError', () => {
            const path = _buildRoute('error/unauthorized');
            return request(endpoint)
                .get(path)
                .then((res) => {
                    expect(res.status).to.equal(401);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    expect(res.body).to.deep.equal({
                        error: '[UnauthorizedError] Authorization failed'
                    });
                    expect(res.error).to.exist;
                });
        });
    });

    describe('[Not Found Requests]', () => {
        it('should return a 404 if the handler throws a NotFoundError', () => {
            const path = _buildRoute('error/notfound');
            return request(endpoint)
                .get(path)
                .then((res) => {
                    expect(res.status).to.equal(404);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    expect(res.body).to.deep.equal({
                        error: '[NotFoundError] Resource not found'
                    });
                    expect(res.error).to.exist;
                });
        });

        it('should return a 404 for nonexistent paths', () => {
            const path = _buildRoute(_testValues.getString('badPath'));

            return request(endpoint)
                .get(path)
                .then((res) => {
                    expect(res.status).to.equal(404);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    expect(res.body).to.deep.equal({
                        error: '[NotFoundError] Resource not found'
                    });
                    expect(res.error).to.exist;
                });
        });
    });

    describe('[Catch All Errors]', () => {
        it('should return a 500 if the handler throws a generic error', () => {
            const path = _buildRoute('error/error');
            return request(endpoint)
                .get(path)
                .then((res) => {
                    expect(res.status).to.equal(500);
                    expect(res.header['content-type']).to.match(
                        /^application\/json/
                    );
                    expect(res.body).to.deep.equal({
                        error: 'Internal server error'
                    });
                    expect(res.error).to.exist;
                });
        });
    });
});
