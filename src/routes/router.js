/* import { Router as expressRouter } from 'express';
import passport from 'passport';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    get(path, policies, strategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, strategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, strategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    patch(path, policies, strategy, ...callbacks) {
        this.router.patch(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, strategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };
        res.sendSuccessNewResourse = (data) => {
            res.status(201).json({ data });
        };
        res.sendServerError = (error) => {
            res.status(500).json({ error });
        };
        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };
        next();
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if(strategy === passportStrategiesEnum.JWT) {
            passport.authenticate(strategy, function(err, user, info) {
                if(err) return next(err);
                if(!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
                req.user = user;
                next();
            })(req, res, next);
        } else {
            next();
        }
    }

    handlePolicies = (policies) => (req, res, next) => {
        if(policies[0] === accessRolesEnum.PUBLIC) return next();
        const user = req.user;
        if(!policies.includes(user.role.toUpperCase())) return res.status(403).json({ error: 'not permissions' });
        next();
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => { 
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({ status: 'error', message: error.message })
            }
        })
    }
} */
import { Router as expressRouter } from 'express';
import passport from 'passport';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    get(path, ...handlers) {
        this.router.get(path, ...this.buildHandlers(handlers));
    }

    post(path, ...handlers) {
        this.router.post(path, ...this.buildHandlers(handlers));
    }

    put(path, ...handlers) {
        this.router.put(path, ...this.buildHandlers(handlers));
    }

    patch(path, ...handlers) {
        this.router.patch(path, ...this.buildHandlers(handlers));
    }

    delete(path, ...handlers) {
        this.router.delete(path, ...this.buildHandlers(handlers));
    }

    buildHandlers(handlers) {
        // Detecta si el primer argumento es un middleware (función)
        const isMiddleware = typeof handlers[0] === 'function';
        let middlewares = [];
        let policies;
        let strategy;
        let callbacks;

        if (isMiddleware) {
            middlewares = [handlers[0]];
            policies = handlers[1];
            strategy = handlers[2];
            callbacks = handlers.slice(3);
        } else {
            policies = handlers[0];
            strategy = handlers[1];
            callbacks = handlers.slice(2);
        }

        return [
            ...middlewares,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            ...this.applyCallbacks(callbacks)
        ];
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };
        res.sendSuccessNewResourse = (data) => {
            res.status(201).json({ data });
        };
        res.sendServerError = (error) => {
            res.status(500).json({ error });
        };
        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };
        next();
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === passportStrategiesEnum.JWT) {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(err);
                if (!user) return res.status(401).send({ error: info?.message || info?.toString() || 'Unauthorized' });
                req.user = user;
                next();
            })(req, res, next);
        } else {
            next();
        }
    }

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === accessRolesEnum.PUBLIC) return next();
        const user = req.user;
        if (!user || !policies.includes(user.role.toUpperCase())) {
            return res.status(403).json({ error: 'not permissions' });
        }
        next();
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({ status: 'error', message: error.message });
            }
        });
    }
}
