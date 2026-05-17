import { dynId, mountStyles } from "../../runtime/utils.js";
import "./OsFractalNester.js";
import "./OsShadowMesh.js";
import "./OsMicroFrontendDemo.js";

customElements.define("os-complex-shadow-screen", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <div class="screen-container" data-dynid="${dynId("complex-screen")}">
        <header class="screen-header">
          <h1>Extreme Shadow DOM Showcase</h1>
          <p>Demonstrating advanced, highly complex, and non-linear Shadow DOM structures.</p>
        </header>

        <section class="demo-section">
          <h2>1. Fractal Nesting (Exponential Growth)</h2>
          <p class="demo-desc">A recursive component creating a fractal tree of Shadow hosts. Each level branches out, creating massive depth and width.</p>
          <div class="demo-card">
            <os-fractal-nester depth="4" branching-factor="3"></os-fractal-nester>
          </div>
        </section>

        <section class="demo-section">
          <h2>2. Shadow Mesh (Interconnected Topology)</h2>
          <p class="demo-desc">A non-linear web of Shadow hosts. Clicking a node broadcasts a cross-boundary event that highlights other nodes in the mesh.</p>
          <div class="demo-card">
            <os-shadow-mesh size="4"></os-shadow-mesh>
          </div>
        </section>

        <section class="demo-section">
          <h2>3. Micro-Frontend Simulation (Cross-Document)</h2>
          <p class="demo-desc">Simulating a micro-frontend architecture where multiple autonomous, encapsulated apps live inside nested iframes, each with its own Shadow DOM.</p>
          <div class="demo-card">
            <os-micro-frontend-demo></os-micro-frontend-demo>
          </div>
        </section>
      </div>
    `;

    mountStyles(this.shadowRoot, `
      .screen-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .screen-header {
        margin-bottom: 32px;
        border-bottom: 1px solid var(--os-border-soft);
        padding-bottom: 16px;
      }
      .screen-header h1 {
        margin: 0;
        font-size: 2.5rem;
        color: var(--os-text);
      }
      .screen-header p {
        color: var(--os-text-secondary);
        margin-top: 8px;
        font-size: 1.1rem;
      }
      .demo-section {
        margin-bottom: 64px;
      }
      .demo-section h2 {
        font-size: 1.8rem;
        margin-bottom: 8px;
        color: var(--os-text);
      }
      .demo-desc {
        font-size: 0.95rem;
        color: var(--os-text-secondary);
        margin-bottom: 20px;
      }
      .demo-card {
        background: var(--os-card);
        border: 1px solid var(--os-border-soft);
        border-radius: var(--os-radius);
        padding: 32px;
        box-shadow: var(--os-shadow-lg);
      }
    `);
  }
});
