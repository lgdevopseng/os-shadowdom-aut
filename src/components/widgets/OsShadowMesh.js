import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-shadow-mesh", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const meshSize = parseInt(this.getAttribute("size") || "3", 10);
    this.shadowRoot.innerHTML = `<div class="mesh-container" data-dynid="${dynId("mesh")}"></div>`;
    
    const container = this.shadowRoot.querySelector(".mesh-container");
    
    // Create a grid of nodes that are interconnected via events
    for (let i = 0; i < meshSize * meshSize; i++) {
      const node = document.createElement("os-mesh-node");
      node.setAttribute("node-id", i.toString());
      node.setAttribute("total-nodes", (meshSize * meshSize).toString());
      container.appendChild(node);
    }

    this.applyStyles();

    // Listen for mesh-wide interaction events to simulate "interconnectedness"
    this.addEventListener("mesh-ping", (e) => {
      console.log(`[Mesh] Ping from node ${e.detail.from}`);
      this.highlightNode(e.detail.from);
    });
  }

  highlightNode(id) {
    const nodes = this.shadowRoot.querySelectorAll("os-mesh-node");
    nodes.forEach(n => n.classList.remove("active"));
    const target = this.shadowRoot.querySelector(`[node-id="${id}"]`);
    if (target) target.classList.add("active");
  }

  applyStyles() {
    mountStyles(this.shadowRoot, `
      .mesh-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 12px;
        padding: 16px;
      }
    `);
  }
});

customElements.define("os-mesh-node", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const id = this.getAttribute("node-id");
    this.shadowRoot.innerHTML = `
      <div class="mesh-node" data-node-id="${id}">
        <div class="node-content">Node ${id}</div>
      </div>
    `;
    this.applyStyles();

    this.shadowRoot.querySelector(".mesh-node").onclick = () => {
      this.dispatchEvent(new CustomEvent("mesh-ping", {
        bubbles: true,
        composed: true,
        detail: { from: id }
      }));
    };
  }

  applyStyles() {
    mountStyles(this.shadowRoot, `
      .mesh-node {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--os-surface-soft);
        border: 1px solid var(--os-border-soft);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
      }
      .mesh-node:hover {
        background: var(--os-accent-soft);
        border-color: var(--os-accent);
        transform: scale(1.05);
      }
      .mesh-node.active {
        background: var(--os-accent);
        color: white;
        box-shadow: 0 0 15px var(--os-accent);
      }
    `);
  }
});
