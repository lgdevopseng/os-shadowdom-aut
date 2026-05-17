import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-deep-nester", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const depth = parseInt(this.getAttribute("depth") || "0", 10);
    const label = this.getAttribute("label") || `Level ${depth}`;

    this.shadowRoot.innerHTML = `
      <div class="nester-node" data-dynid="${dynId("nester")}">
        <span class="node-label">${label}</span>
        <div class="node-content">
          ${depth > 0 ? `<os-deep-nester depth="${depth - 1}" label="Level ${depth - 1}"></os-deep-nester>` : `<div class="leaf">End of Chain</div>`}
        </div>
      </div>
    `;

    mountStyles(this.shadowRoot, `
      .nester-node {
        border-left: 2px solid var(--os-border-soft);
        padding-left: 16px;
        margin-top: 8px;
        display: flex;
        flex-direction: column;
      }
      .node-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--os-text-secondary);
      }
      .node-content {
        margin-left: 8px;
      }
      .leaf {
        font-size: 0.75rem;
        color: var(--os-text-tertiary);
        padding: 4px;
        font-style: italic;
      }
    `);
  }
});
