import './main.css'
import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$styles = {
    fill: "white"
};
app.mount('#app')
