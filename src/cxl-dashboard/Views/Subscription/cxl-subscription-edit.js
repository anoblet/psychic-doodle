import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-form-layout/vaadin-form-item';
import { css, customElement, html, LitElement, property } from 'lit-element';

@customElement('cxl-subscription-edit')
export class CXLSubscriptionEditElement extends LitElement {
  @property({ type: Object }) item = {};

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1rem;
      }

      vaadin-form-item {
        margin: 1rem;
        border-bottom: 1px solid #000;
      }
    `;
  }

  render() {
    return html`
      <vaadin-form-layout>
        <vaadin-text-field label="First Name" value=${this.item.first_name}></vaadin-text-field>
        <vaadin-text-field label="Last Name" value=${this.item.last_name}></vaadin-text-field>
        <vaadin-text-field label="Email" value=${this.item.email}></vaadin-text-field>
        <br />
        <vaadin-form-item colspan="2"> </vaadin-form-item>
        <br />
        <vaadin-button>Cancel</vaadin-button>
        <vaadin-button>Save</vaadin-button>
      </vaadin-form-layout>
    `;
  }
}
