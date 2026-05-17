import { Bus } from "./bus.js";
import { createStore } from "./reactive.js";

export const bus = new Bus();

// App-level state (OutSystems: Session Variables / Client Variables)
export const appStore = createStore({
  route: { name: "customers", params: {} },
  isNavigating: false
});

export function setRoute(route) {
  appStore.set({ route });
  bus.emit("Route.Changed", route);
}
