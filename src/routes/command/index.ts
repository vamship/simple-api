import { buildRoutes } from '@vamship/expressjs-routes';
import express, { Router } from 'express';
import routeDefinitions from './route-definitions';

/**
 * Configures and returns a set of routes based on a list of declarative route
 * definitions.
 *
 * @module routes
 */
const router: Router = Router();

router.use(express.json());
buildRoutes(routeDefinitions, router);

export default router;
