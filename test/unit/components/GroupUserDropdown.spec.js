import {shallowMount} from '@vue/test-utils';
import UserDropdown from '@/components/GroupUserDropdown.vue';
import {mockTranslation} from "../../commonTestSetup";
import {apiService} from "@/apiService";

let autocomplete = 1
mockTranslation()
describe('UserDropdown.vue', () => {
  let wrapper;

  it('renders without errors', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches users based on search input', async () => {
    wrapper.setData({ search: 'user' });
    await wrapper.vm.fetchUsers();

    expect(wrapper.vm.users).toEqual(['user1', 'user2']);
  });

  it('emits selected user when a user is selected', async () => {
    const selectedUser = 'user1';

    wrapper.setData({ selectedUser });
    await wrapper.vm.emitSelectedUser();

    expect(wrapper.emitted().selected[0]).toEqual([selectedUser]);
  });

  it('resets data after user is selected', async () => {
    const selectedUser = 'user1';
    wrapper.setData({ selectedUser });
    await wrapper.setProps({ autocompleteKey: 2 })

    expect(wrapper.vm.selectedUser).toBe(null);
    expect(wrapper.vm.users).toEqual([]);
    expect(wrapper.vm.search).toBe(null);
  });


  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getUsersNotInGroup = vi.fn(() => Promise.resolve({data: {
        _embedded: { radcheck: [
            { username: 'user1' },
            { username: 'user2' },
          ] },
        page: { totalElements: 3 }
      }}));

    wrapper = shallowMount(UserDropdown, {
      propsData: {
        groupName: 'TestGroup',
        autocompleteKey: autocomplete,
      },
    })
  })
});
