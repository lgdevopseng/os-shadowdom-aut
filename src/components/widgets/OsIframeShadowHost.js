import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-iframe-shadow-host", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <div class="iframe-container" data-dynid="${dynId("iframe-host")}">
        <p class="iframe-label">Shadow Host inside Iframe</p>
        <iframe id="demo-iframe" sandbox="allow-scripts"></iframe>
      </div>
    `;

    const iframe = this.shadowRoot.getElementById("demo-iframe");

    // Use srcdoc to inject a complete HTML document
    // Inside this document, we define a custom element that has its own shadow root
    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; margin: 0; padding: 10px; background: #f9f9f9; }
          os-iframe-content { display: block; border: 1px solid #ccc; padding: 10px; margin-top: 5px; }
        </style>
      </head>
      <body>
        <os-iframe-content></os-iframe-content>
        <script type="module">
          customElements.define("os-iframe-content", class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: "open" });
            }
            connectedCallback() {
              this.shadowRoot.innerHTML = `
                <div style="color: #d32f2f; font-weight: bold;">
                  I am a Shadow Host inside an Iframe!
                </div>
              `;
            }
          });
        </script>
      </body>
      </html>
    `;

    mountStyles(this.shadowRoot, `
      .iframe-container {
        border: 1px solid var(--os-border-soft);
        padding: 16px;
        margin-top: 8px;
        background: var(--os-bg-alt, #fafafa);
      }
      .iframe-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--os-text-secondary);
        margin-bottom: 8px;
      }
      #demo-iframe {
        width: 100%;
        height: 100px;
        border: 1px solid var(--os-border-soft);
      }
    `);
  }
});
