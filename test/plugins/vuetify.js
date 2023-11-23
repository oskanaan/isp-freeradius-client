import {
  VDataTableServer, VDataTable
} from "vuetify/labs/VDataTable";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'
import DeleteDialog from "@/components/DeleteDialog.vue";
import GenericOperation from '@/views/common/GenericOperation.vue';

export default createVuetify({
  components: {
    VDataTableServer,
    VDataTable,
    DeleteDialog,
    GenericOperation,
    ...components
  },
  directives,
})