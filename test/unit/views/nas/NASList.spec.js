import flushPromises from 'flush-promises';
import NASList from "../../../../src/views/nas/NASList.vue";
import {createTestWrapper, mockTranslation, createNASEntity, mockNASResponse} from "/test/commonTestSetup.js"
import {apiService} from "@/apiService";

mockTranslation()
describe('NASList.vue', () => {
  it('renders and filters a list of NAS entities', async () => {
    // NAS Name filter by nasRouter2
    const nas = [
        createNASEntity(2, "nasRouter1", "Cisco", "radius-server2.example.com"),
        createNASEntity(2, "nasRouter2", "Cisco", "radius-server2.example.com"),
        createNASEntity(2, "nasRouter3", "Cisco", "radius-server2.example.com"),
        ]

    apiService.searchNAS.mockResolvedValue({data:{
        _embedded: { nas: nas },
        page: { totalElements: nas.length }
      }});
    let wrapper = createTestWrapper(NASList)

    // unfiltered page contents
    await flushPromises();
    let rows = wrapper.findAll("table > tbody > tr");
    expect(rows).toHaveLength(3);
    expect(rows[0].find("td").text()).toBe("nasRouter1");
    expect(rows[1].find("td").text()).toBe("nasRouter2");
    expect(rows[2].find("td").text()).toBe("nasRouter3");

    const nasNameFilter = wrapper.find('[data-testid="nasNameFilter"]');
    nasNameFilter.element.value = 'nasRouter2'
    await nasNameFilter.trigger('input');
    await flushPromises()
    rows = wrapper.findAll("table > tbody > tr");
    expect(rows[0].find("td").text()).toBe("nasRouter1");
  });

  it('opens NASAdd dialog when Add icon is clicked', async () => {
    let wrapper = createTestWrapper(NASList);
    // Find the Add icon and trigger a click event
    const addIcon = wrapper.find('[icon="mdi-plus"]');
    await addIcon.trigger('click');

    expect(wrapper.vm.addDialog).toBe(true);
  });

  it('opens NASEdit dialog with data when Edit icon is clicked', async () => {
    // Mock the NAS data for edit
    const nas = createNASEntity(2, "nasRouter2", "Cisco", "radius-server2.example.com")

    apiService.getNAS.mockResolvedValue(nas)
    apiService.searchNAS.mockResolvedValue({data:{
        _embedded: { nas: [nas] },
        page: { totalElements: nas.length }
      }});

    let wrapper = createTestWrapper(NASList);
    await flushPromises();
    // Find the first Edit icon in the NAS list and trigger a click event
    const editIcon = wrapper.findAll('[icon="mdi-pencil"]').at(0);
    await editIcon.trigger('click');
    await flushPromises();

    // Assuming editNASDialog becomes true when the Edit dialog opens
    expect(wrapper.vm.editDialog).toBe(true);
    // Check if the NAS data has been loaded for editing
    expect(wrapper.vm.nasToEdit).toBe('2');
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.searchNAS = vi.fn(() => Promise.resolve({
      _embedded: { groups: [] },
      page: { totalElements: 0 }
    }));
    apiService.deleteNAS = vi.fn(() => Promise.resolve());
    apiService.getNAS = vi.fn(() => Promise.resolve());
  });
});