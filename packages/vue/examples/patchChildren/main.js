import { createApp } from '../../dist/simple-vue3-model.esm.js';
import App from "./App.js";

const rootContainer = document.querySelector("#root");
createApp(App).mount(rootContainer);
