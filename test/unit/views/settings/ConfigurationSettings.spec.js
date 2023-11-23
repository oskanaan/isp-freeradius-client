import { describe, it, expect, vi } from 'vitest';
import flushPromises from 'flush-promises';
import ConfigurationSettings from "@/views/settings/ConfigurationSettings.vue";
import { createTestWrapper, mockTranslation } from "/test/commonTestSetup.js";
import {apiService} from "@/apiService";


const fakeSettings = {
  cronPattern: 'some-pattern',
  phoneRegex: 'some-regex',
  defaultLatitude: 'some-latitude',
  defaultLongitude: 'some-longitude'
};

mockTranslation();

describe('ConfigurationSettings.vue', () => {
  it('fetches and populates settings data on mount', async () => {
    let wrapper = createTestWrapper(ConfigurationSettings);
    await flushPromises();

    expect(wrapper.vm.settings.cronPattern).toBe(fakeSettings.cronPattern);
    expect(wrapper.vm.settings.phoneRegex).toBe(fakeSettings.phoneRegex);
    expect(wrapper.vm.settings.defaultLatitude).toBe(fakeSettings.defaultLatitude);
    expect(wrapper.vm.settings.defaultLongitude).toBe(fakeSettings.defaultLongitude);
  });

  it('handles error and sets fieldErrors', async () => {
    const errs = {
      errors: [
        { field: 'cronPattern', message: 'Cron Pattern is required' },
        { field: 'phoneRegex', message: 'Phone Regex is required' },
        { field: 'defaultLatitude', message: 'Default Latitude is required' },
        { field: 'defaultLongitude', message: 'Default Longitude is required' },
      ]
    };

    // Set the mock implementation for saveConfigurationSettings to simulate an error
    apiService.saveConfigurationSettings.mockImplementation(() => Promise.reject({ response: { data: errs } }));

    let wrapper = createTestWrapper(ConfigurationSettings);

    // Call the method that should trigger the save
    await wrapper.vm.saveConfigurationSettings();
    await flushPromises();

    // Check that the field errors have been set as expected
    for (const err of errs.errors) {
      expect(wrapper.vm.fieldErrors[err.field]).toBe(err.message);
    }
  });

  // Reset mocks after each test
  beforeEach(() => {
    apiService.getConfigurationSettings = vi.fn(() => Promise.resolve({ data: fakeSettings }));
    apiService.saveConfigurationSettings = vi.fn(() => Promise.resolve());
  });
});
