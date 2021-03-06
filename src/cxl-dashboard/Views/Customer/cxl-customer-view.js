import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-form-layout/vaadin-form-item';
import '@vaadin/vaadin-split-layout';
import { css, customElement, html, property } from 'lit-element';
import { nothing } from 'lit-html';
import { cache } from 'lit-html/directives/cache.js';
import { Customer } from "../../Models/Customer";
import { ViewElement } from '../../BaseElements/ViewElement';
import "../Membership/cxl-membership-grid";
import "../Order/cxl-order-grid";
import "../Subscription/cxl-subscription-grid";

@customElement('cxl-customer-view')
export class CXLCustomerViewElement extends ViewElement {
    @property({ type: Number }) _tabIndex = 0;

    _itemType = Customer;

    static get styles() {
        return [super.styles, css`
            vaadin-split-layout {
                height: 100%;
            }

            #tabs {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            #tabContent {
                height: 100%;
                overflow: hidden;
            }
        `];
    }

    render() {
        return html`
            <vaadin-split-layout orientation="vertical">
                <cxl-customer-details .item=${this.item} get-disabled></cxl-customer-details>
                <div id="tabs">
                    <vaadin-tabs @selected-changed="${this._selectedChanged}">
                        <vaadin-tab> Orders (${this.item?.orders?.total}) </vaadin-tab>
                        <vaadin-tab> Subscriptions (${this.item?.subscriptions?.total}) </vaadin-tab>
                        <vaadin-tab> Memberships (${this.item?.memberships?.total}) </vaadin-tab>
                    </vaadin-tabs>
                    <div id="tabContent">
                        ${this.item ? html`
                        ${cache(this._tabIndex === 0 ? html`<cxl-order-grid .params=${{ customer: this.item.id }}></cxl-order-grid>
                        ` : nothing)}
                        ${cache(this._tabIndex === 1 ? html`<cxl-subscription-grid .params=${{ customer: this.item.id }}>
                        </cxl-subscription-grid>` : nothing)}
                        ${cache(this._tabIndex === 2 ? html`<cxl-membership-grid .params=${{ customer: this.item.id }}>
                        </cxl-membership-grid>` : nothing)}
                        ` : nothing}
                    </div>
                </div>
            </vaadin-split-layout>
        `;
    }

    _selectedChanged(e) {
        this._tabIndex = e.detail.value;
    }

    async getItem() {
        const item = await super.getItem();

        await Promise.all([
            item.getOrders(),
            item.getSubscriptions(),
            item.getMemberships()
        ])

        return item;
    }
}
