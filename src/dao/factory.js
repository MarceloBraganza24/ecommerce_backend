import config from '../config/config.js';

export let Users;
export let Products;
export let Carts;
export let Tickets;

const persistence = config.persistence;

switch(persistence) {
    case 'MONGO':
        console.log('Working with MongoDB persistence');
        const mongoose = await import('mongoose');
        await mongoose.connect(config.mongoUrl);
        const { default: UsersMongo } = await import('./dbManagers/users.manager.js');
        const { default: ProductsMongo } = await import('./dbManagers/products.manager.js');
        const { default: CartsMongo } = await import('./dbManagers/carts.manager.js');
        const { default: TicketsMongo } = await import('./dbManagers/tickets.manager.js');
        Users = UsersMongo;
        Products = ProductsMongo;
        Carts = CartsMongo;
        Tickets = TicketsMongo;
        break;
    case 'FILE':
        /* const { default: UsersFile } = await import('./fileManagers/users.manager.js');
        Users = UsersFile; */
        break;
}