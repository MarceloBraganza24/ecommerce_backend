export class UserAlreadyExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class UserByEmailExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class PartnerExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class PartnerByEmailMembershipNumberExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class PartnerByEmailExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class InvalidCredentials extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class ExpiredToken extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class CategoryExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class ProductExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class DeliveryFormExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class SellerAddressExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CouponExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class ExpiredCoupon extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class PurchaseExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}