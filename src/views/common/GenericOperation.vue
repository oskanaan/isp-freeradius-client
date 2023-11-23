<template>
  <v-container style="height: 75%">
    <h1 class="display-1 mb-4">{{ title }}</h1>

    <v-container>
      <v-form @submit.prevent="performOperation">
        <v-row>
          <v-col>
            <v-row v-for="field in fields" :key="field.model" :style="field.style">
              <EnumDropdown v-model="entity[field.model]"
                            v-if="field.component === 'EnumDropdown'"
                            :enum-key="field.enumKey"
                            :enum-values="field.enumValues"
                            :error-messages="fieldErrors[field.model]"/>
              <CityDropdown v-model="entity[field.model]"
                            :errorMessages="fieldErrors[field.model]"
                            v-if="field.component === 'CityDropdown'"/>
              <AttributeDictionaryDropdown :current-value="entity[field.model]"
                                           :search-value="attributeDictionarySearchValue"
                                           @selected="(value) => entity[field.model] = value"
                                           :errorMessages="fieldErrors[field.model]"
                                           v-if="field.component === 'AttributeDictionaryDropdown'"/>

              <ClientDropdown @selected="(client) => entity[field.model] = client"
                            :client-id="entity[field.model]"
                              class="mb-5"
                            v-if="field.component === 'UserDropdown'"/>
              <v-text-field
                  v-model="entity[field.model]"
                  v-if="field.type !== 'password' && (field.component === undefined || field.component === 'TextField')"
                  :label="field.label"
                  :type="field.type ? field.type : 'text'"
                  required
                  :error-messages="fieldErrors[field.model]"
                  :style="field.style || ''"
                  :onblur="validateConfirmPassword"
                  class="compact-text-field">
              </v-text-field>

              <div v-if="field.component === 'readonly'"
                   class="v-input v-input--horizontal v-input--center-affix v-input--density-default v-locale--is-ltr v-input--dirty v-text-field compact-text-field mb-7"
                   data-no-activator>
                <div class="v-input__control">
                  <strong class="mr-5">{{ field.label }}:</strong> {{ entity[field.model] }}
                </div>
              </div>


              <div v-if="field.component === 'date'"
                   class="v-input v-input--horizontal v-input--center-affix v-input--density-default v-locale--is-ltr v-input--dirty v-text-field compact-text-field mb-7"
                   style="height: 50px"
                   data-no-activator>
                <div class="v-input__control">
                  <div class="v-field v-field--active v-field--center-affix v-field--dirty v-field--variant-filled v-theme--light v-locale--is-ltr">
                    <div class="v-field__overlay"></div>
                    <div class="v-field__field">
                      <label class="v-label v-field-label v-field-label--floating" :for="field.model">{{ field.label }}</label>
                      <Datepicker
                          :id="field.model"
                          style="width: 100%;"
                          v-if="field.component === 'date'"
                          v-model="entity[field.model]"
                          inputFormat="dd-MM-yyyy"
                          class="v-field__input"
                          :typeable="true"/>
                      <div class="v-field__outline">
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <v-col :style="field.style" v-if="field.type === 'password'">
                <v-row style="margin: 0">
                  <v-text-field
                      v-model="entity[field.model]"
                      :label="field.label"
                      :type="field.type ? field.type : 'text'"
                      required
                      :error-messages="fieldErrors[field.model]"
                      :style="field.style || ''"
                      :onblur="validateConfirmPassword"
                      class="compact-text-field"/>
                </v-row>
                <v-row style="margin: 0">
                  <v-text-field
                      v-model="confirmPassword"
                      v-if="field.type === 'password'"
                      :label="this.$t(`confirmPassword`)"
                      type="password"
                      required
                      :error-messages="confirmPasswordError"
                      :onblur="validateConfirmPassword"
                      class="compact-text-field"
                      data-testid="confirmPassword"
                  />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <slot name="additional-columns" :entity="entity"/>
        </v-row>
        <v-row align="end">
          <v-col align="right">
            <v-btn type="cancel" @click.prevent="$emit('close-dialog')" style="margin-right: 15px">{{ cancelLabel === undefined ? this.$t('cancel') : cancelLabel }}</v-btn>
            <v-btn type="submit" color="primary">{{ addLabel === undefined ? this.$t('add') : addLabel }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import EnumDropdown from "@/components/EnumDropdown.vue";
import CityDropdown from "@/components/CityDropdown.vue";
import AttributeDictionaryDropdown from "@/components/AttributeDictionaryDropdown.vue";
import moment from "moment";
import Datepicker from 'vue3-datepicker'
import ClientDropdown from "@/components/ClientDropdown.vue";
import {apiService} from "@/apiService";

export default {
  components: {ClientDropdown, Datepicker, CityDropdown, EnumDropdown, AttributeDictionaryDropdown},
  props: {
    title: String,
    fields: Array,
    endpoint: String,
    id: {
      type: String,
      required: false,
    },
    addLabel: {
      type: String
    },
    cancelLabel: {
      type: String
    }
  },
  data() {
    return {
      entity: {},
      fieldErrors: {},
      isCreate: false,
      confirmPassword: '',
      confirmPasswordError: '',
      attributeDictionarySearchValue: ''
    };
  },
  methods: {
    performOperation() {
      if (this.confirmPassword === '' && this.findPasswordField() !== undefined) {
        this.confirmPasswordError = this.$t(`confirmPasswordMandatory`)
        return
      }
      if (this.confirmPasswordError !== '') {
        return
      }

      let processSuccess = () => {
        this.$store.dispatch('toggleSuccessSnackbar');
        this.$emit('data-updated');
        this.$emit('close-dialog')
      }

      let processError = (error) => {
        if (error.response.data.errors) {
          const receivedErrors = {};
          for (const err of error.response.data.errors) {
            receivedErrors[err.field] = err.message;
          }
          this.fieldErrors = receivedErrors;
        }
      }

      let e = Object.assign({}, this.entity)
      this.$emit('before-perform-operation', e);

      //Format date
      //Supports one date item at the moment. That is sufficient for our use case but can be extended to support multiple
      let dateAttribute = this.fields.find(field => field.component === 'date')
      if (dateAttribute != null && e[dateAttribute.model] !== undefined) {
        e[dateAttribute.model] = this.formatDateTime(this.entity[dateAttribute.model], "yyyy-MM-DDTHH:mm")
      }

      if (this.isCreate) {
        apiService.genericAdd(this.endpoint, e)
            .then(processSuccess)
            .catch(error => processError(error));
      } else {
        apiService.genericUpdate(this.endpoint, e, this.id)
            .then(processSuccess)
            .catch(error => processError(error));
      }
    },
    validateConfirmPassword() {
      let password = this.findPasswordField()

      if (password !== undefined && this.confirmPassword !== '' && this.entity[password.model] !== this.confirmPassword) {
        this.confirmPasswordError = this.$t(`confirmPasswordMismatch`)
      } else {
        this.confirmPasswordError = ''
      }
    },
    fetchEntity() {
      if (this.id !== null) {
        apiService.genericGet(this.endpoint, this.id)
            .then((response) => {
              this.entity = response.data;
              console.error(this.entity);

              //Supports one dictionary item at the moment. That is sufficient for our use case.
              let dictionaryAttribute = this.fields.find(field => field.component === 'AttributeDictionaryDropdown')
              if (dictionaryAttribute != null) {
                this.attributeDictionarySearchValue = this.entity[dictionaryAttribute.model]
              }

              //Supports one date item at the moment. That is sufficient for our use case but can be extended to support multiple
              let dateAttribute = this.fields.find(field => field.component === 'date')
              if (dateAttribute != null && this.entity[dateAttribute.model] !== undefined) {
                this.entity[dateAttribute.model] = this.getDate(this.entity[dateAttribute.model])
              }

              let password = this.findPasswordField()

              if (password !== undefined) {
                this.confirmPassword = this.entity[password.model]
              }
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
      }
    },
    getDate(dateString) {
      return new Date(dateString)
    },
    dateToString(newDate) {
      return newDate.toISOString().split('T')[0]
    },
    findPasswordField() {
      return this.fields.find((field) => field.type === 'password')
    },
    formatDateTime(dateTimeString, format) {
      return moment(dateTimeString).format(format);
    },
  },
  mounted() {
    this.isCreate = this.id === undefined //No ID passed, this is in create mode.

    if (this.isCreate) {
      this.fields.forEach((field) => { //Process defaults
            if (field.defaultValue !== undefined) {
              this.entity[field.model] = field.defaultValue
            }
          }
      )
    } else {
      this.fetchEntity() //In edit mode, populate entity details
    }
  }
};
</script>

<style scoped>
.compact-text-field {
  padding: 0px;
}

.v-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  padding-bottom: 4px;
}
.v-col {
  padding: 0px;
}
</style>