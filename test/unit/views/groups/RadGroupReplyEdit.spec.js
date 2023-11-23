import {shallowMount} from '@vue/test-utils';
import RadGroupReplyEdit from '@/views/groups/RadGroupReplyEdit.vue';
import flushPromises from "flush-promises";
import {mockTranslation} from "../../../commonTestSetup";
import {apiService} from "@/apiService";

mockTranslation();

describe('RadGroupReplyEdit', () => {
  it('fetches replies on mount', async () => {
    const fetchedReplies = [
      { attribute: 'attr1', operator: '==', value: 'val1' },
      { attribute: 'attr2', operator: '==', value: 'val2' },
    ];

    apiService.getGroupReplyByGroupName.mockResolvedValue({data:{
        _embedded: { radgroupreply: fetchedReplies },
        page: { totalElements: fetchedReplies.length }
      }});

    const wrapper = shallowMount(RadGroupReplyEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await flushPromises();

    expect(wrapper.vm.replies).toEqual(fetchedReplies);
  });

  it('adds a new reply attribute', async () => {

    apiService.addGroupReply.mockResolvedValue();

    const wrapper = shallowMount(RadGroupReplyEdit, {
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

  it('updates a reply attribute', async () => {
    apiService.updateGroupReply.mockResolvedValue();

    const wrapper = shallowMount(RadGroupReplyEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.setData({ id: '1', attributeName: 'attr1', operator: '!=', value: 'newVal' });
    await wrapper.vm.updateAttribute();
    await flushPromises();

    expect(wrapper.vm.editMode).toBe(false);
  });

  it('deletes selected reply attributes', async () => {
    apiService.deleteGroupReplies.mockResolvedValue();
    const repliesToDelete = [
      { attribute: 'attr1', operator: '==', value: 'val1' },
    ];

    apiService.getGroupReplyByGroupName.mockResolvedValue({data:{
        _embedded: { radgroupreply: repliesToDelete },
        page: { totalElements: repliesToDelete.length }
      }});

    const wrapper = shallowMount(RadGroupReplyEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.setData({ selectedGroupReplies: repliesToDelete });
    await wrapper.vm.deleteSelectedAttributes();
    await flushPromises();

    expect(wrapper.vm.selectedGroupReplies).toEqual([]);
  });

  it('handles pagination - page update', async () => {
    const wrapper = shallowMount(RadGroupReplyEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.vm.updatePage(2);

    expect(wrapper.vm.page).toBe(2);
  });

  it('handles pagination - items per page update', async () => {
    const wrapper = shallowMount(RadGroupReplyEdit, {
      propsData: { groupName: 'TestGroup' },
    });

    await wrapper.vm.updateItemsPerPage(20);

    expect(wrapper.vm.pageSize).toBe(20);
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getGroupReplyByGroupName = vi.fn(() => Promise.resolve({
      _embedded: { radgroupreply: [] },
      page: { totalElements: 0 }
    }));
    apiService.addGroupReply = vi.fn(() => Promise.resolve());
    apiService.updateGroupReply = vi.fn(() => Promise.resolve());
    apiService.deleteGroupReplies = vi.fn(() => Promise.resolve());
  });
});
