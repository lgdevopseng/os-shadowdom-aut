import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

customElements.define("os-iframe-shadow-host", class extends HTMLElement {
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
    const locale = appStore.get().locale || "en";

    this.shadowRoot.innerHTML = `
      <div class="iframe-container" data-dynid="${dynId("iframe-host")}">
        <p class="iframe-label">${t("iframe_title")}</p>
        <iframe id="demo-iframe" sandbox="allow-scripts"></iframe>
      </div>
    `;

    const iframe = this.shadowRoot.getElementById("demo-iframe");

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; margin: 0; padding: 10px; background: #f9f9f9; }
          os-iframe-content { display: block; border: 1px solid #ccc; padding: 10px; margin-top: 5px; }
        </style>
      </head>
      <body data-locale="${locale}">
        <os-iframe-content></os-iframe-content>
        <script type="module">
          window.addEventListener("message", (e) => {
            if (e.data.type === "locale-changed") {
              document.body.setAttribute("data-locale", e.data.locale);
              const content = document.querySelector("os-iframe-content");
              if (content) content.requestUpdate();
            }
          });

          customElements.define("os-iframe-content", class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: "open" });
            }
            requestUpdate() { this.render(); }
            connectedCallback() { this.render(); }
            render() {
              const locale = document.body.getAttribute("data-locale") || "en";
              const translations = {
                en: "I am a Shadow Host inside an Iframe!",
                ja: "私はiframe内のシャドウホストです！"
              };
              this.shadowRoot.innerHTML = \`
                <div style="color: #d32f2f; font-weight: bold;">
                  \${translations[locale] || translations.en}
                </div
              \`;
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

    setTimeout(() => {
      iframe.contentWindow?.postMessage({ type: "locale-changed", locale }, "*");
    }, 100);
  }
});
