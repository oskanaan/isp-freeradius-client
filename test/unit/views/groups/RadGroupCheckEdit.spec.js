import { shallowMount } from '@vue/test-utils';
import RadGroupCheckEdit from '@/views/groups/RadGroupCheckEdit.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";
import {mockTranslation} from "../../../commonTestSetup";
import {apiService} from "@/apiService";

const mock = new MockAdapter(axios);
mockTranslation()

describe('RadGroupCheckEdit', () => {

  it('fetches attributes on mount', async () => {
    const fetchedAttributes = [
      { attribute: 'attr1', operator: '==', value: 'val1' },
      { attribute: 'attr2', operator: '==', value: 'val2' },
    ];
    apiService.getGroupCheckByGroupName.mockResolvedValue({data:{
        _embedded: { radgroupcheck: fetchedAttributes },
        page: { totalElements: fetchedAttributes.length }
      }});

    let wrapper = shallowMount(RadGroupCheckEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await flushPromises();

    expect(wrapper.vm.replies).toEqual(fetchedAttributes);
  });

  it('adds a new attribute', async () => {
    let wrapper = shallowMount(RadGroupCheckEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.setData({ attributeName: 'attr3', operator: '==', value: 'val3' });
    await wrapper.vm.addAttribute();
    await flushPromises();

    expect(wrapper.vm.attributeName).toBe('');
    expect(wrapper.vm.operator).toBe('');
    expect(wrapper.vm.value).toBe('');
    expect(wrapper.vm.autocompleteKey).toBe(1);
  });

  it('updates an attribute', async () => {
    let wrapper = shallowMount(RadGroupCheckEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.setData({ id: '1', attributeName: 'attr1', operator: '!=', value: 'newVal' });
    await wrapper.vm.updateAttribute();
    await flushPromises();

    expect(wrapper.vm.editMode).toBe(false);
  });

  it('deletes selected attributes', async () => {
    let wrapper = shallowMount(RadGroupCheckEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    const attributesToDelete = [
      { attribute: 'attr1', operator: '==', value: 'val1' },
    ];
    await wrapper.setData({ selectedRadChecks: attributesToDelete });
    await wrapper.vm.deleteSelectedAttributes();
    await flushPromises();

    expect(wrapper.vm.selectedRadChecks).toEqual([]);
  });

  it('handles pagination - page update', async () => {
    let wrapper = shallowMount(RadGroupCheckEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.vm.updatePage(2);

    expect(wrapper.vm.page).toBe(2);
  });

  it('handles pagination - items per page update', async () => {
    let wrapper = shallowMount(RadGroupCheckEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.vm.updateItemsPerPage(20);

    expect(wrapper.vm.pageSize).toBe(20);
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getGroupCheckByGroupName = vi.fn(() => Promise.resolve({
      _embedded: { radgroupreply: [] },
      page: { totalElements: 0 }
    }));
    apiService.addGroupCheck = vi.fn(() => Promise.resolve());
    apiService.updateGroupCheck = vi.fn(() => Promise.resolve());
    apiService.deleteGroupChecks = vi.fn(() => Promise.resolve());
  });
});
