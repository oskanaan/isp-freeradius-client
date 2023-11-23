import {shallowMount} from '@vue/test-utils';
import RadReplyEdit from '@/views/clients/RadReplyEdit.vue';
import flushPromises from 'flush-promises';
import {createRadReplyEntity, mockTranslation} from "../../../commonTestSetup";
import {apiService} from "@/apiService";

mockTranslation()

describe('RadReplyEdit.vue', () => {

  it('fetches attributes on mount', async () => {
    let radReplies = [
      createRadReplyEntity(1, "username1", "==", "PPP"),
      createRadReplyEntity(2, "username2", "==", "PPP"),
      createRadReplyEntity(3, "username3", "==", "PPP")
    ]

    apiService.getRadReplyAttributes.mockResolvedValue({data:{
        _embedded: { radreply: radReplies },
        page: { totalElements: radReplies.length }
      }});

    let wrapper = shallowMount(RadReplyEdit, {
      propsData: {username: 'test_user'},
    });

    await wrapper.vm.fetchAttributes();
    await flushPromises();

    expect(wrapper.vm.attributes).toEqual(radReplies);
  });

  it('adds an attribute', async () => {
    let radReply = [createRadReplyEntity(4, "test_user", "==", "PPP")]
    apiService.getRadReplyAttributes.mockResolvedValue({data:{
        _embedded: { radreply: radReply },
        page: { totalElements: radReply.length }
      }});

    let wrapper = shallowMount(RadReplyEdit, {
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
    let wrapper = shallowMount(RadReplyEdit, {
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
    let wrapper = shallowMount(RadReplyEdit, {
      propsData: {username: 'test_user'},
    });

    await wrapper.vm.updatePage(2);

    expect(wrapper.vm.page).toBe(2);
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getRadReplyAttributes = vi.fn(() => Promise.resolve({
      _embedded: { radreply: [] },
      page: { totalElements: 0 }
    }));
    apiService.addRadReplyAttribute = vi.fn(() => Promise.resolve());
    apiService.deleteRadReplyAttributes = vi.fn(() => Promise.resolve());
    apiService.updateRadReplyAttribute = vi.fn(() => Promise.resolve());
  });

})