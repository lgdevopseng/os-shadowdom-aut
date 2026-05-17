import { dynId, escapeHtml, mountStyles } from "../runtime/utils.js";
import { createStore } from "../runtime/reactive.js";
import { bus } from "../runtime/store.js";
import { Settings_LoadSettings } from "../actions/Settings/LoadSettings.js";
import { Settings_SaveSettings } from "../actions/Settings/SaveSettings.js";

customElements.define("os-screen-settings", class extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.screenId = dynId("screen_settings");
    this.screenStore = createStore({
      isLoading: true,
      isSaving: false,
      feedback: null,
      settings: {
        theme: "Light",
        language: "en",
        itemsPerPage: 10,
        notifications: true,
        weeklyDigest: false,
        betaFeatures: false
      }
    });
  }

  connectedCallback(){
    this.unsub = this.screenStore.subscribe(() => { this.render(); this.wire(); });
    this.render(); this.wire();

    bus.emit("Screen.OnInitialize", { screenId: this.screenId });
    Settings_LoadSettings({ screenStore: this.screenStore }).catch(() => {});
  }

  disconnectedCallback(){ this.unsub?.(); }

  showFeedback(type, text){
    this.screenStore.set({ feedback: { type, text } });
    setTimeout(() => {
      const cur = this.screenStore.get().feedback;
      if (cur?.text === text) this.screenStore.set({ feedback: null });
    }, 2500);
  }

  render(){
    const s = this.screenStore.get();
    const disabled = s.isLoading || s.isSaving;
    const animate = this._animated ? "" : " animate";

    this.shadowRoot.innerHTML = `
      <div class="screen${animate}" data-os-widget="Screen" data-dynid="${dynId("scr")}">
        <div class="hdr">
          <div>
            <div class="h1" data-test-id="screen-title">Settings</div>
            <div class="crumbs">Home / Settings</div>
          </div>
          <div class="act">
            <button class="osui-btn ghost" data-test-id="btn-reload" ${disabled?"disabled":""}>Reload</button>
            <button class="osui-btn primary" data-test-id="btn-save" ${disabled?"disabled":""}>
              ${s.isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        ${s.feedback ? `<os-feedback data-test-id="feedback" type="${s.feedback.type}" text="${escapeHtml(s.feedback.text)}"></os-feedback>` : ""}

        <os-block data-os-block="MainContent">
          <os-section title="Preferences" data-test-id="section-preferences">
            <os-card data-test-id="card-settings">
              ${s.isLoading ? `
                <os-skeleton data-test-id="skeleton"></os-skeleton>
              ` : `
                <div class="grid">
                  <div class="osui-field">
                    <div class="osui-label">Theme</div>
                    <select class="osui-select" data-test-id="sel-theme" ${disabled?"disabled":""}>
                      ${["Light","Dark","System"].map(t => `<option ${s.settings.theme===t?"selected":""}>${t}</option>`).join("")}
                    </select>
                  </div>

                  <div class="osui-field">
                    <div class="osui-label">Language</div>
                    <select class="osui-select" data-test-id="sel-language" ${disabled?"disabled":""}>
                      ${[
                        { id:"en", label:"English" },
                        { id:"es", label:"Spanish" },
                        { id:"pt", label:"Portuguese" },
                        { id:"fr", label:"French" }
                      ].map(l => `<option value="${l.id}" ${s.settings.language===l.id?"selected":""}>${l.label}</option>`).join("")}
                    </select>
                  </div>

                  <div class="osui-field">
                    <div class="osui-label">Items Per Page</div>
                    <input class="osui-input" data-test-id="inp-items" type="number" min="5" max="50"
                      value="${escapeHtml(s.settings.itemsPerPage)}" ${disabled?"disabled":""}/>
                  </div>

                  <div class="osui-field">
                    <div class="osui-label">Notifications</div>
                    <label class="chk">
                      <input data-test-id="chk-notifications" type="checkbox" ${s.settings.notifications?"checked":""} ${disabled?"disabled":""}/>
                      <span>Enable product notifications</span>
                    </label>
                  </div>

                  <div class="osui-field">
                    <div class="osui-label">Weekly Digest</div>
                    <label class="chk">
                      <input data-test-id="chk-weekly" type="checkbox" ${s.settings.weeklyDigest?"checked":""} ${disabled?"disabled":""}/>
                      <span>Send weekly summary</span>
                    </label>
                  </div>

                  <div class="osui-field">
                    <div class="osui-label">Beta Features</div>
                    <label class="chk">
                      <input data-test-id="chk-beta" type="checkbox" ${s.settings.betaFeatures?"checked":""} ${disabled?"disabled":""}/>
                      <span>Enable early access</span>
                    </label>
                  </div>
                </div>
              `}
            </os-card>
          </os-section>
        </os-block>
      </div>
    `;
    this._animated = true;

    mountStyles(this.shadowRoot, `
      .screen.animate > *{animation:rise .5s ease both;}
      .screen.animate > *:nth-child(1){animation-delay:.02s;}
      .screen.animate > *:nth-child(2){animation-delay:.08s;}
      .screen.animate > *:nth-child(3){animation-delay:.14s;}
      .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
      .h1{font-size:22px;font-weight:700;}
      .crumbs{font-size:12px;opacity:.65;margin-top:2px;}
      .act{display:flex;gap:8px;}
      .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;}
      .chk{display:flex;align-items:center;gap:10px;font-size:13px;}
      .chk input{accent-color:var(--os-accent);}
      @keyframes rise{
        from{opacity:0;transform:translateY(10px);}
        to{opacity:1;transform:translateY(0);}
      }
      @media (max-width: 760px){
        .grid{grid-template-columns:1fr;}
      }
    `);
  }

  wire(){
    const r = this.shadowRoot;
    const s = this.screenStore.get();
    const update = (key, value) => {
      this.screenStore.set({ settings: { ...this.screenStore.get().settings, [key]: value } });
    };

    r.querySelector('[data-test-id="btn-reload"]')?.addEventListener("click", async () => {
      await Settings_LoadSettings({ screenStore: this.screenStore });
      this.showFeedback("info", "Reloaded");
    });
    r.querySelector('[data-test-id="btn-save"]')?.addEventListener("click", async () => {
      await Settings_SaveSettings({ screenStore: this.screenStore, settings: s.settings });
      this.showFeedback("success", "Settings saved");
    });

    r.querySelector('[data-test-id="sel-theme"]')?.addEventListener("change", (e) => update("theme", e.target.value));
    r.querySelector('[data-test-id="sel-language"]')?.addEventListener("change", (e) => update("language", e.target.value));
    r.querySelector('[data-test-id="inp-items"]')?.addEventListener("input", (e) => update("itemsPerPage", parseInt(e.target.value || "0", 10)));
    r.querySelector('[data-test-id="chk-notifications"]')?.addEventListener("change", (e) => update("notifications", e.target.checked));
    r.querySelector('[data-test-id="chk-weekly"]')?.addEventListener("change", (e) => update("weeklyDigest", e.target.checked));
    r.querySelector('[data-test-id="chk-beta"]')?.addEventListener("change", (e) => update("betaFeatures", e.target.checked));
  }
});
