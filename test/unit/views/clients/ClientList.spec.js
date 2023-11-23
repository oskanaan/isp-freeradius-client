import flushPromises from 'flush-promises';
import ClientList from "../../../../src/views/clients/ClientList.vue";
import {createClientEntity, createTestWrapper, mockClientResponse, mockTranslation} from "/test/commonTestSetup.js"
import {apiService} from "@/apiService";

mockTranslation()
describe('ClientList.vue', () => {
  it('renders and filters a list of clients', async () => {
    // Username filter by alice31
    let clients = [
      createClientEntity(16, "alice16", "demo31", "Alice Johnson", "SUSPENDED"),
      createClientEntity(31, "alice31", "demo31", "Alice Johnson", "SUSPENDED"),
      createClientEntity(1, "alice1", "demo31", "Alice Johnson", "SUSPENDED"),
    ]
    apiService.getClientList.mockResolvedValue({data:{
        _embedded: { clients: clients },
        page: { totalElements: clients.length }
      }});

    let wrapper = createTestWrapper(ClientList)

    // unfiltered page contents
    await flushPromises()
    let rows = wrapper.findAll("table > tbody > tr")
    expect(rows[0].find("td").text()).toBe("alice16");
    expect(rows[1].find("td").text()).toBe("alice31");
    expect(rows[2].find("td").text()).toBe("alice1");

    wrapper.vm.usernameFilter = 'alice31'
    await wrapper.vm.$nextTick();
    wrapper.find('[data-testid="usernameFilter"]').trigger('blur');
    await flushPromises();
    rows = wrapper.findAll("table > tbody > tr")
    expect(rows[0].find("td").text()).toBe("alice16");

  });

  it('opens ClientAdd dialog when Add icon is clicked', async () => {
    localStorage.setItem("type", "ADMIN")
    let wrapper = createTestWrapper(ClientList)
    // Find the Add icon and trigger a click event
    const addIcon = wrapper.find('[icon="mdi-plus"]');
    await addIcon.trigger('click');

    expect(wrapper.vm.addClientDialog).toBe(true);
  });

  it('opens ClientEdit dialog with data when Edit icon is clicked', async () => {
    // Mock the client data for edit
    const client = {
      id: 16,
      username: 'alice',
      password: 'secret',
      fullName: 'Alice Johnson',
      status: 'SUSPENDED'
    }
    apiService.getClient.mockResolvedValue(client);
    apiService.getClientList.mockResolvedValue({data:{
        _embedded: { clients: [client] },
        page: { totalElements: 1 }
      }});

    localStorage.setItem("type", "ADMIN")
    let wrapper = createTestWrapper(ClientList)
    await flushPromises()
    // Find the first Edit icon in the client list and trigger a click event
    const editIcon = wrapper.findAll('[icon="mdi-pencil"]').at(0);
    await editIcon.trigger('click');
    await flushPromises();

    // Assuming editClientDialog becomes true when the Edit dialog opens
    expect(wrapper.vm.editClientDialog).toBe(true);
    // Check if the client data has been loaded for editing
    expect(wrapper.vm.clientToEditId).toBe('16');
  });

  it('edit icon shouldnt be visible for non-admins', async () => {
    // Mock the client data for edit
    const client = {
      id: 16,
      username: 'alice',
      password: 'secret',
      fullName: 'Alice Johnson',
      status: 'SUSPENDED'
    }
    apiService.getClient.mockResolvedValue(client);
    apiService.getClientList.mockResolvedValue({data:{
        _embedded: { clients: [client] },
        page: { totalElements: 1 }
      }});

    // Find the first Edit icon in the client list and trigger a click event
    localStorage.setItem("type", "EMPLOYEE")
    let wrapper = createTestWrapper(ClientList)
    await flushPromises()
    const editIcon = wrapper.findAll('[icon="mdi-pencil"]').at(0);
    expect(editIcon).toBe(undefined);
  })

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.getClientList = vi.fn(() => Promise.resolve({
      _embedded: { clients: [] },
      page: { totalElements: 0 }
    }));
    apiService.deleteClient = vi.fn(() => Promise.resolve());
    apiService.getClient = vi.fn(() => Promise.resolve());
  });
});
