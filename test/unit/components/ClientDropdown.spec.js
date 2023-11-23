import { shallowMount } from '@vue/test-utils';
import ClientAutocomplete from '@/components/ClientDropdown.vue';
import {mockTranslation} from "../../commonTestSetup";
import {apiService} from "@/apiService";

let autocompleteKey = 1;
mockTranslation()

describe('ClientAutocomplete.vue', () => {
  let wrapper;

  it('renders without errors', () => {
    wrapper = shallowMount(ClientAutocomplete, {
      propsData: {
        clientId: 1,
        autocompleteKey,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('fetches clients based on search input', async () => {
    let clients = [
          { id: 1, fullName: 'John Doe' },
          { id: 2, fullName: 'Jane Doe' },
        ]
    apiService.getClientsByFullName.mockResolvedValue({data:{
        _embedded: { clients: clients },
        page: { totalElements: clients.length }
      }});

    wrapper = shallowMount(ClientAutocomplete, {
      propsData: {
        clientId: 1,
        autocompleteKey,
      },
    });

    wrapper.setData({ search: 'Doe' });
    await wrapper.vm.fetchUsers();

    expect(wrapper.vm.clients).toEqual([
      { id: '1', fullName: 'John Doe' },
      { id: '2', fullName: 'Jane Doe' },
    ]);
  });

  it('emits selected client ID when a client is selected', async () => {
    const selectedClient = { id: '1', fullName: 'John Doe' };
    apiService.getClient.mockResolvedValue(selectedClient)

    wrapper = shallowMount(ClientAutocomplete, {
      propsData: {
        clientId: 1,
        autocompleteKey,
      },
    });

    wrapper.setData({ selectedClient: selectedClient });
    await wrapper.vm.emitSelectedClient();

    expect(wrapper.emitted().selected[0]).toEqual([ { id: '1', fullName: 'John Doe' }]);
  });

  it('loads client data when clientId is provided', async () => {
    apiService.getClient.mockResolvedValue({ id: 1, fullName: 'John Doe' });

    wrapper = shallowMount(ClientAutocomplete, {
      propsData: {
        clientId: 1,
        autocompleteKey,
      },
    });
    await wrapper.vm.loadClientData();

    expect(apiService.getClient).toHaveBeenCalledWith(1); // Ensure the method was called with the correct ID
  });


  beforeEach(() => {
    // Mock the apiService methods
    apiService.getClientsByFullName = vi.fn((search, pageLimit, cancelToken) =>
        Promise.resolve({
          _embedded: {
            clients: [
              { id: 1, fullName: 'John Doe' },
              { id: 2, fullName: 'Jane Doe' },
            ],
          },
        })
    );
    apiService.getClient = vi.fn((id) =>
        Promise.resolve({ id: 1, fullName: 'John Doe' })
    );
  });
});
