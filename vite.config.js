import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['v-select', 'v-snackbar', 'v-card-title', 'v-text-field', 'v-sheet', 'v-col', 'v-row',
            'v-card-text', 'v-card', 'v-container', 'v-icon', 'v-chip', 'v-btn', 'v-card-actions', 'v-dialog', 'v-form'
              , 'EnumDropdown', 'CityDropdown'//,'v-data-table-server', 'v-tooltip'
            ].includes(tag),
          }
        }
      })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vuetify'],
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
})
