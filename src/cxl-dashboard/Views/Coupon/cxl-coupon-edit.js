import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-form-layout/vaadin-form-item';
import { css, customElement, html, property } from 'lit-element';
import { EditElement } from '../../BaseElements/EditElement';
import { WooCommerce } from '../../WooCommerce';

@customElement('cxl-coupon-edit')
export class CXLCouponEditElement extends EditElement {
  @property({ type: Object }) item = {};

  _changes = {};

  endpoint = "coupons";

  static get styles() {
    return [super.styles, css`
      vaadin-form-item {
        margin: 1rem;
        border-bottom: 1px solid #000;
      }
    `];
  }

  render() {
    return html`
      <vaadin-form-layout>
        <vaadin-text-field label="First Name" name="first_name" value=${this.item.first_name} @change=${this._onChange}>
        </vaadin-text-field>
        <vaadin-text-field label="Last Name" value=${this.item.last_name}></vaadin-text-field>
        <vaadin-text-field label="Email" value=${this.item.email}></vaadin-text-field>
        <br />
        <vaadin-form-item colspan="2"> </vaadin-form-item>
        <br />
        <vaadin-button>Cancel</vaadin-button>
        <vaadin-button @click=${this._save}>Save</vaadin-button>
      </vaadin-form-layout>
    `;
  }

  _onChange = (event) => {
    this._changes[event.target.name] = event.target.value;
  }

  async _save() {
    const data = {
      first_name: "John",
      billing: {
        first_name: "James"
      },
      shipping: {
        first_name: "James"
      }
    };

    // { force: true } is needed for objects which are not allowed to be in the trash (coupons)
    const response = await WooCommerce().delete("coupons/4", { force: true });
    return;
  }
}
