import { WooCommerce } from "../WooCommerce";
import { measure } from "../Utilities";

export class BaseModel {
    constructor(args) {
        Object.assign(this, args);
    }
}