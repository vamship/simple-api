import { args as _argErrors, http as _httpErrors } from '@vamship/error-types';
import { Router } from 'express';

const { BadRequestError, NotFoundError, UnauthorizedError } = _httpErrors;
const { SchemaError } = _argErrors;

/**
 * Configures and returns a set of routes based on a list of declarative route
 * definitions.
 *
 * @module routes
 */
const router: Router = Router();
router.get('/error/:type', (req, res, next) => {
    const errorType = req.params.type;
    switch (errorType.toLowerCase()) {
        case 'badrequest':
            next(new BadRequestError());
        case 'notfound':
            next(new NotFoundError());
        case 'unauthorized':
            next(new UnauthorizedError());
        case 'schema':
            next(new SchemaError());
        case 'error':
        default:
            next(new Error());
    }
});

export default router;
