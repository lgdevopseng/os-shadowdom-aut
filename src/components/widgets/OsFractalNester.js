import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

customElements.define("os-fractal-nester", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.appUnsub = appStore.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() {
    this.appUnsub?.();
  }

  render() {
    const depth = parseInt(this.getAttribute("depth") || "0", 10);
    const branchingFactor = parseInt(this.getAttribute("branching-factor") || "2", 10);
    const id = this.getAttribute("fractal-id") || dynId("fractal");

    // If depth is 0, we are at the leaf node
    if (depth <= 0) {
      this.shadowRoot.innerHTML = `
        <div class="fractal-leaf" data-dynid="${id}">
          <span class="leaf-text">${t("deep_label")} (Leaf)</span>
        </div>
      `;
      this.applyStyles(true);
      return;
    }

    // Build the fractal structure: one parent node containing 'branchingFactor' children
    let childrenHtml = "";
    for (let i = 0; i < branchingFactor; i++) {
      childrenHtml += `<os-fractal-nester
        depth="${depth - 1}"
        branching-factor="${branchingFactor}"
        fractal-id="${id}-child-${i}">
      </os-fractal-nester>`;
    }

    this.shadowRoot.innerHTML = `
      <div class="fractal-node" data-dynid="${id}">
        <div class="node-header">
          <span class="node-depth">${t("deep_label")} ${depth}</span>
          <span class="node-id">${id.slice(0, 8)}...</span>
        </div>
        <div class="node-children">
          ${childrenHtml}
        </div>
      </div>
    `;

    this.applyStyles(false);
  }

  applyStyles(isLeaf) {
    if (isLeaf) {
      mountStyles(this.shadowRoot, `
        .fractal-leaf {
          padding: 4px 8px;
          background: var(--os-accent-soft);
          border-radius: 4px;
          font-size: 10px;
          color: var(--os-accent);
          border: 1px solid var(--os-accent);
        }
        .leaf-text { font-weight: bold; }
      `);
    } else {
      mountStyles(this.shadowRoot, `
        .fractal-node {
          border: 1px solid var(--os-border-soft);
          padding: 8px;
          margin: 4px;
          background: var(--os-surface);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }
        .node-header {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: var(--os-text-tertiary);
          margin-bottom: 4px;
          border-bottom: 1px solid var(--os-border-ultra-light);
          padding-bottom: 2px;
        }
        .node-children {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
          gap: 4px;
        }
      `);
    }
  }
});
