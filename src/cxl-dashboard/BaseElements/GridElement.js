import { css, html, query } from "lit-element";
import { BaseElement } from "./BaseElement";
import { render } from "lit-html";

export class GridElement extends BaseElement {
  _collectionType;
  params = {};

  get _props() {
    return {};
  }

  @query("vaadin-grid") grid;

  static get styles() {
    return [super.styles, css`
      :host {
        flex: 1;
      }

      vaadin-grid {
        height: 100%;
      }
    `];
  }

  constructor() {
    super();
    this._boundActionColumnRenderer = this._actionColumnRenderer.bind(this);
  }

  firstUpdated() {
    this.grid.dataProvider = this.dataProvider.bind(this);

    this._registerActiveItemChangedListener();
  }

  _actionColumnRenderer(root, column, rowData) {
    const path = rowData.item._getViewPath ? rowData.item._getViewPath(this) : `/${this._baseRoute}/view/${rowData.item.id}`

    render(
      html`
        <vaadin-button @click=${this._navigate} href=${path}>View</vaadin-button>
      `,
      root
    );
  }

  _registerActiveItemChangedListener() {
    this.grid.addEventListener('active-item-changed', (event) => {
      const item = event.detail.value;
      this.grid.selectedItems = item ? [item] : [];
    });
  }

  _setSelectedItem(index) {
    this._selectedItem = this.items[index];
  }

  // filters don't work
  async dataProvider(params, callback) {
    const filter = { ...this.filter };

    params.filters.map((_filter) => {
      filter[_filter.path] = _filter.value;
    });

    let order = "desc";
    let orderby = "id";

    params.sortOrders.map((_sortOrder) => {
      orderby = _sortOrder.path;
      order = _sortOrder.direction;
    });

    const list = await new this._collectionType({ ...this._props, ...{ params: { ...this.params, ...filter, order, orderby, page: ++params.page, per_page: params.pageSize } } }).get();

    console.log(list);

    callback(list.getItems(), list.getTotal());
  }
}
