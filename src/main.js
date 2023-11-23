import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './styles.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors'
import {
  VDataTableServer, VDataTable
} from "vuetify/labs/VDataTable";
import '@mdi/font/css/materialdesignicons.css'
import { createI18n } from 'vue-i18n';
import store from './store';
import GoogleMap from 'vue3-google-map';
import http from "./http.js";

const i18n = createI18n({
  locale: 'en', // Set the initial locale to English
  messages: {
    en: require('./locales/en.json'),
  },
});

const vuetify = createVuetify({
  components: {
    VDataTableServer,
    VDataTable,
    ...components
  },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: colors.red.darken1, // #E53935
          secondary: colors.red.lighten4, // #FFCDD2
          accent: '#607D8B',
        }
      },
    },
  },
})

let app = createApp(App)
app.config.globalProperties.$http = http;


app.use(router)
    .use(i18n)
    .use(vuetify)
    .use(store)
    .directive('focus', {
      mounted(el) {
        findInputElement(el).focus()
      }
    })
    .use(GoogleMap, {
      load: {
        apiKey: 'AIzaSyB6wRfuiMoXlqkABJ9zrjdRKFLYZatSjqM',
      },
    })
    .mount('#app')

function findInputElement(el) {
  if (el.tagName === 'INPUT') {
    return el;
  }

  for (let child of el.children) {
    let input = findInputElement(child);
    if (input) {
      return input;
    }
  }

  return null;
}
