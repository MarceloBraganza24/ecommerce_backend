import express from "express";
import cors from 'cors';
import { __mainDirname } from './utils/utils.js';
import initializePassport from "./config/passport.js";
import passport from "passport";
import { addLogger } from './utils/logger.js';
import cookieParser from 'cookie-parser';
import config from "./config/config.js";
import path from 'path';

import UsersRouter from "./routes/users.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import ProductsRouter from "./routes/products.router.js";
import CategoriesRouter from "./routes/categories.router.js";
import DeliveryFormRouter from "./routes/deliveryForm.router.js";
import SellerAddressRouter from "./routes/sellerAddress.router.js";
import CouponsRouter from "./routes/coupons.router.js";
import CartsRouter from "./routes/carts.router.js";
import ShipmentsRouter from "./routes/shipments.router.js";
import PaymentsRouter from "./routes/payments.router.js";
import TicketsRouter from "./routes/tickets.router.js";

const app = express();

const usersRouter = new UsersRouter();
const sessionsRouter = new SessionsRouter();
const productsRouter = new ProductsRouter();
const categoriesRouter = new CategoriesRouter();
const deliveryFormRouter = new DeliveryFormRouter();
const sellerAddressRouter = new SellerAddressRouter();
const couponsRouter = new CouponsRouter();
const cartsRouter = new CartsRouter();
const shipmentsRouter = new ShipmentsRouter();
const paymentsRouter = new PaymentsRouter();
const ticketsRouter = new TicketsRouter();

app.use(addLogger);
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', // o donde esté corriendo tu frontend
    credentials: true
  }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

initializePassport();
app.use(passport.initialize());

app.use('/api/users', usersRouter.getRouter());
app.use('/api/sessions', sessionsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/categories', categoriesRouter.getRouter());
app.use('/api/deliveryForm', deliveryFormRouter.getRouter());
app.use('/api/sellerAddresses', sellerAddressRouter.getRouter());
app.use('/api/coupons', couponsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/calculate-shipments', shipmentsRouter.getRouter());
app.use('/api/payments', paymentsRouter.getRouter());
app.use('/api/tickets', ticketsRouter.getRouter());

app.listen(config.port, () => console.log(`Server running on port ${config.port}`))