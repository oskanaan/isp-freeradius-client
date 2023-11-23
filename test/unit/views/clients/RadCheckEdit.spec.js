import {shallowMount} from '@vue/test-utils';
import RadCheckEdit from '@/views/clients/RadCheckEdit.vue';
import flushPromises from 'flush-promises';
import {createRadCheckEntity, mockTranslation} from "../../../commonTestSetup";
import {apiService} from "@/apiService";

mockTranslation()

describe('RadCheckEdit.vue', () => {

  it('fetches attributes on mount', async () => {
    let checks = [
      createRadCheckEntity(1, "username1", "==", "PPP"),
      createRadCheckEntity(2, "username2", "==", "PPP"),
      createRadCheckEntity(3, "username3", "==", "PPP")
    ]

    apiService.getRadCheckAttributes.mockResolvedValue({data:{
        _embedded: { radcheck: checks },
        page: { totalElements: checks.length }
      }});

    let wrapper = shallowMount(RadCheckEdit, {
      propsData: {username: 'test_user'},
    });

    await wrapper.vm.fetchAttributes();
    await flushPromises();

    expect(wrapper.vm.attributes).toEqual(checks);
  });

  it('adds an attribute', async () => {
    let radChecks = [createRadCheckEntity(4, "test_user", "==", "PPP")]

    apiService.getRadCheckAttributes.mockResolvedValue({data:{
        _embedded: { radcheck: radChecks },
        page: { totalElements: radChecks.length }
      }});

    let wrapper = shallowMount(RadCheckEdit, {
      propsData: {username: 'test_user'},
    });

    await wrapper.setData({attributeName: 'attr3', operator: '>=', value: 'value3'});
    await wrapper.vm.addAttribute();
    await flushPromises();

    expect(wrapper.vm.attributeName).toBe('');
    expect(wrapper.vm.operator).toBe('');
    expect(wrapper.vm.value).toBe('');
    expect(wrapper.vm.autocompleteKey).toBe(1);
  });

  it('deletes selected attributes', async () => {
    let wrapper = shallowMount(RadCheckEdit, {
      propsData: {username: 'test_user'},
    });

    const attributesToDelete = [
      {attribute: 'attr1', operator: '==', value: 'value1'},
    ];
    await wrapper.setData({selectedRadChecks: attributesToDelete});
    await wrapper.vm.deleteSelectedAttributes();
    await flushPromises();

    expect(wrapper.vm.selectedRadChecks).toEqual([]);
  });

  it('handles pagination - page update', async () => {
    let wrapper = shallowMount(RadCheckEdit, {
      propsData: {username: 'test_user'},
    });

    await wrapper.vm.updatePage(2);

    expect(wrapper.vm.page).toBe(2);
  });


  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getRadCheckAttributes = vi.fn(() => Promise.resolve({
      _embedded: { radusergroups: [] },
      page: { totalElements: 0 }
    }));
    apiService.addRadCheckAttribute = vi.fn(() => Promise.resolve());
    apiService.deleteRadCheckAttributes = vi.fn(() => Promise.resolve());
    apiService.updateRadCheckAttribute = vi.fn(() => Promise.resolve());
  });
})