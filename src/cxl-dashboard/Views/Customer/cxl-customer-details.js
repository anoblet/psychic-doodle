import "@vaadin/vaadin-dialog";
import "@vaadin/vaadin-text-field/vaadin-email-field";
import { css, customElement, html, property, query } from 'lit-element';
import { render } from 'lit-html';
import { ViewElement } from '../../BaseElements/ViewElement';
import { Customer } from "../../Models/Customer";
import { notify } from "../../Utilities";
import objectPath from "object-path";

@customElement('cxl-customer-details')
export class CXLCustomerDetailsElement extends ViewElement {
    _itemType = Customer;
    _updates = {};

    @query('form') form;

    static get styles() {
        return [super.styles, css`
            label::after {
                content: ':'
            }

            .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }

            .grid.gap {
                grid-gap: 0.25rem;
            }
        `];
    }

    render() {
        return html`
            <form>
                <div class="grid gap">
                    <vaadin-checkbox disabled checked=${this.item?.isPayingCustomer}>Paying customer</vaadin-checkbox>
                </div>
                <hr />
                <div class="grid gap">
                    <vaadin-text-field @change=${this._updateField} label="First name" name="firstName"
                        value=${this.item?.firstName}>
                    </vaadin-text-field>
                    <vaadin-text-field @change=${this._updateField} label="Last name" name="lastName" value=${this.item?.lastName}>
                    </vaadin-text-field>
                    <vaadin-email-field @change=${this._updateField} label="Email" name="email" value=${this.item?.email}>
                    </vaadin-email-field>
                </div>
                <hr />
                <div class="grid gap">
                    <vaadin-text-field @change=${this._updateField} label="Address" name="billing.address"
                        value=${this.item?.billing?.address}>
                    </vaadin-text-field>
                    <vaadin-text-field @change=${this._updateField} label="City" name="billing.city"
                        value=${this.item?.billing?.city}>
                    </vaadin-text-field>
                    <vaadin-text-field @change=${this._updateField} label="Country" name="billing.country"
                        value=${this.item?.billing?.country}>
                    </vaadin-text-field>
                    <vaadin-text-field @change=${this._updateField} label="Phone" name="billing.phone"
                        value=${this.item?.billing?.phone}>
                    </vaadin-text-field>
                </div>
                <hr />
                <div class="grid gap">
                    <vaadin-text-field disabled label="Customer since" value=${this.item?.customerSince}></vaadin-text-field>
                    <vaadin-text-field disabled label="Subscriber since" value=${this.item?.subscriberSince}></vaadin-text-field>
                    <vaadin-text-field disabled label="Team" value=${this.item?.team}></vaadin-text-field>
                    <vaadin-text-field disabled label="Subscription" value=${this.item?.productName}></vaadin-text-field>
                    <vaadin-text-field disabled label="Currency" value=${this.item?.currency}></vaadin-text-field>
                </div>
                <hr />
                <div class="grid gap">
                    <vaadin-button>Reset</vaadin-button>
                    <vaadin-button @click=${this._save}>Save</vaadin-button>
                </div>
            </form>
        `
    }

    async getItem() {
        const item = await super.getItem();
        
        await Promise.all([item.getMemberships(), item.getOrders(), item.getSubscriptions()]);

        return item;
    }

    _confirm({ callback, message }) {
        const dialog = document.createElement('vaadin-dialog');

        dialog.renderer = (root, dialog) => {
            const cancel = () => {
                dialog.opened = false;
            }

            const confirm = () => {
                dialog.opened = false;
                callback();
            }

            render(html`
                <span style="display: flex; justify-content: center;">${message}</span>
                <hr />
                <vaadin-button @click=${cancel}>Cancel</vaadin-button>
                <vaadin-button @click=${confirm}>OK</vaadin-button>
            `, root);
        };

        this.shadowRoot.appendChild(dialog);

        dialog.opened = true;
    }

    _save() {
        const callback = async () => {
            await this.item.save.bind(this.item)();

            if (this.item._response.status === 200) {
                notify({ message: "Success!", theme: "success" });
            } else {
                notify({ message: "Error!", theme: "error" });
            }
        }

        this._confirm({ callback, message: 'Are you sure?' });
    }

    _updateField(e) {
        console.log(e.target.name);
        console.log(e.target.value)
        objectPath.set(this.item._updates, e.target.name, e.target.value);
        console.log(this.item);
        this.item[e.target.getAttribute('name')] = e.target.value;
        console.log(this.item._updates);
    }
}
