import { html, property } from "lit-element";
import { BaseElement } from "./BaseElement";
import { WooCommerce } from "../WooCommerce";

export class EditElement extends BaseElement {
    @property({ type: Object }) item = {};

    updated(changedProperties) {
        if (changedProperties.has("item") && (changedProperties.get("item") || {}).id !== this.item.id)
            this._getItem();
    }

    async _getItem() {
        let isError = false;

        this.pending = true;

        const el = this._createLoadingElement();
        this.shadowRoot.appendChild(el);

        try {
            this.item = (await WooCommerce({ version: this.wooCommerceVersion }).get(`${this.endpoint}/${this.item.id}`)).data;
        } catch (e) {
            isError = true;
            this._notification({ message: html`Cannot load item`, theme: "error" });
        }

        this.shadowRoot.removeChild(el);

        if (!isError) this.pending = false;
    }

    _onChange = (event) => {
        this.item[event.target.name] = event.target.value;
    }
}
