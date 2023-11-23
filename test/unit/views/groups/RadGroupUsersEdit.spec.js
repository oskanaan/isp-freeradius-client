import {shallowMount} from '@vue/test-utils';
import RadGroupUsersEdit from '@/views/groups/RadGroupUsersEdit.vue';
import {mockTranslation} from "/test/commonTestSetup.js"
import flushPromises from "flush-promises";
import {apiService} from "@/apiService";

mockTranslation()
describe('GroupUserComponent.vue', () => {
  it('fetches users on mount', async () => {
    const fetchedUsers = [
      { username: 'user1', groupName: 'TestGroup' },
      { username: 'user2', groupName: 'TestGroup' },
    ];
    apiService.getUsersInGroup.mockResolvedValue({data:{
      _embedded: { radusergroups: fetchedUsers },
      page: { totalElements: fetchedUsers.length }
    }});

    let wrapper = shallowMount(RadGroupUsersEdit, {
      propsData: {
        groupName: 'TestGroup',
      },
    });

    await wrapper.vm.fetchUsers();
    await flushPromises()

    expect(wrapper.vm.users).toEqual(fetchedUsers);
  });

  it('adds a new user', async () => {
    apiService.addUserToGroup.mockResolvedValue();
    let wrapper = shallowMount(RadGroupUsersEdit, {
      propsData: {
        groupName: 'TestGroup',
      },
    });

    await wrapper.setData({ newUser: 'user3' });
    await wrapper.vm.addUser();
    await flushPromises()

    expect(wrapper.vm.newUser).toBe('');  // newUser should be reset
    expect(wrapper.vm.autocompleteKey).toBe(1);  // autocompleteKey should be incremented
  });

  it('deletes selected users', async () => {
    apiService.deleteUsersFromGroup.mockResolvedValue();
    let wrapper = shallowMount(RadGroupUsersEdit, {
      propsData: {
        groupName: 'TestGroup',
      },
    });

    const usersToDelete = [
      { username: 'user1', groupName: 'TestGroup' },
    ];
    await wrapper.setData({ selectedUsers: usersToDelete });
    await wrapper.vm.deleteSelectedUsers();
    await flushPromises()

    expect(wrapper.vm.selectedUsers).toEqual([]);  // selectedUsers should be reset
  });

  it('handles pagination - page update', async () => {
    let wrapper = shallowMount(RadGroupUsersEdit, {
      propsData: {
        groupName: 'TestGroup',
      },
    });

    await wrapper.vm.updatePage(2);

    expect(wrapper.vm.page).toBe(2);
  });

  it('handles pagination - items per page update', async () => {
    let wrapper = shallowMount(RadGroupUsersEdit, {
      propsData: {
        groupName: 'TestGroup',
      },
    });

    await wrapper.vm.updateItemsPerPage(20);

    expect(wrapper.vm.pageSize).toBe(20);
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getUsersInGroup = vi.fn(() => Promise.resolve({
      _embedded: { radusergroups: [] },
      page: { totalElements: 0 }
    }));
    apiService.addUserToGroup = vi.fn(() => Promise.resolve());
    apiService.deleteUsersFromGroup = vi.fn(() => Promise.resolve());
  });
});
