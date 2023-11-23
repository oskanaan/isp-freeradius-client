import flushPromises from 'flush-promises';
import CityList from "@/views/cities/CityList.vue";
import {createTestWrapper, mockTranslation} from "/test/commonTestSetup.js"
import {apiService} from "@/apiService";

mockTranslation();

describe('CityList.vue', () => {
  it('renders and filters a list of cities', async () => {
    let wrapper = createTestWrapper(CityList);
    await flushPromises()
    let rows = wrapper.findAll("table > tbody > tr");
    expect(rows).toHaveLength(3);
    expect(rows[0].find("td").text()).toBe("Paris");
    expect(rows[1].find("td").text()).toBe("London");
    expect(rows[2].find("td").text()).toBe("Berlin");

    wrapper.vm.cityNameFilter = 'London';
    await wrapper.vm.$nextTick();
    wrapper.find('[data-testid="cityNameFilter"]').trigger('input');
    await flushPromises();

    rows = wrapper.findAll("table > tbody > tr");
    expect(rows).toHaveLength(1);
    expect(rows[0].find("td").text()).toBe("London");
  });

  it('opens CityAdd dialog when Add icon is clicked', async () => {
    let wrapper = createTestWrapper(CityList);
    await flushPromises()
    const addIcon = wrapper.find('[icon="mdi-plus"]');
    await addIcon.trigger('click');
    expect(wrapper.vm.addCityDialog).toBe(true);
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.fetchCities = vi.fn(() => Promise.resolve({data: {
      _embedded: { cities: [
          { id: 1, name: "Paris" },
          { id: 2, name: "London" },
          { id: 3, name: "Berlin" }
        ] },
      page: { totalElements: 3 }
    }}));
  });
});

