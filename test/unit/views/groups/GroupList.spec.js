import flushPromises from 'flush-promises';
import RadGroupList from "@/views/groups/RadGroupList.vue";
import {
  createGroup,
  createTestWrapper,
  mockTranslation
} from "/test/commonTestSetup.js"
import {apiService} from "@/apiService";

mockTranslation();

describe('RadGroupList.vue', () => {
  it('renders and filters a list of RadGroupCheck entities', async () => {
    const groups = [
      createGroup(1, "groupName1"),
      createGroup(2, "groupName2"),
      createGroup(3, "groupName3")
    ];

    apiService.searchGroups.mockResolvedValue({data:{
        _embedded: { groups: groups },
        page: { totalElements: groups.length }
      }});

    let wrapper = createTestWrapper(RadGroupList);

    await flushPromises();

    let rows = wrapper.findAll("table > tbody > tr");
    expect(rows[0].find("td").text()).toBe("groupName1");
    expect(rows[1].find("td").text()).toBe("groupName2");
    expect(rows[2].find("td").text()).toBe("groupName3");

  });

  it('opens RadGroupCheckAdd dialog when Add icon is clicked', async () => {
    const groups =[
      createGroup(1, "groupName1"),
      createGroup(2, "groupName2"),
      createGroup(3, "groupName3")
    ];

    apiService.searchGroups.mockResolvedValue({data:{
        _embedded: { groups: groups },
        page: { totalElements: groups.length }
      }});

    let wrapper = createTestWrapper(RadGroupList);
    const addIcon = wrapper.find('[data-testid="addIcon"]');
    await addIcon.trigger('click');

    expect(wrapper.vm.addDialog).toBe(true);
  });

  it('opens Delete dialog when Delete icon is clicked', async () => {
    const groups =[
      createGroup(1, "groupName1"),
      createGroup(2, "groupName2"),
      createGroup(3, "groupName3")
    ];

    apiService.searchGroups.mockResolvedValue({data:{
        _embedded: { groups: groups },
        page: { totalElements: groups.length }
      }});

    let wrapper = createTestWrapper(RadGroupList);
    await flushPromises();
    const deleteIcon = wrapper.find('[data-testid="deleteIcon"]');
    await deleteIcon.trigger('click');

    expect(wrapper.vm.deleteDialog).toBe(true);
  });


  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.searchGroups = vi.fn(() => Promise.resolve({
      _embedded: { groups: [] },
      page: { totalElements: 0 }
    }));
    apiService.deleteGroup = vi.fn(() => Promise.resolve());
  });
});
