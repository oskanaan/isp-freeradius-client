import InvoiceList from '@/views/invoicing/InvoiceList.vue';
import { mockTranslation, createTestWrapper } from '/test/commonTestSetup.js';
import {apiService} from "@/apiService";
import flushPromises from "flush-promises";

mockTranslation();

describe('InvoiceList.vue', () => {
  let wrapper;

  it('fetches invoices on mount', async () => {
    // Mock API response for invoice fetching
    const invoices = [
          { id: 1, status: 'ACTIVE', totalCost: 100 },
          { id: 2, status: 'ACTIVE', totalCost: 200 }]

    apiService.searchInvoices.mockResolvedValue({data:{
        _embedded: { invoices: invoices },
        page: { totalElements: invoices.length }
      }});

    wrapper = createTestWrapper(InvoiceList, {});
    await flushPromises()
    expect(wrapper.vm.invoices.length).toBe(2);
  });

  it('opens dialog for adding an invoice', async () => {
    wrapper = createTestWrapper(InvoiceList, {});
    wrapper.vm.addInvoice();
    expect(wrapper.vm.addDialog).toBe(true);
  });

  it('opens dialog for editing an invoice', async () => {
    wrapper = createTestWrapper(InvoiceList, {});
    wrapper.vm.editInvoice({ id: 1 });
    expect(wrapper.vm.editDialog).toBe(true);
    expect(wrapper.vm.invoiceToEdit).toBe('1');
  });

  beforeEach(() => {
    // Reset the mocks before each test
    vi.resetAllMocks();

    // Mock the apiService methods
    apiService.searchInvoices = vi.fn(() => Promise.resolve({
      _embedded: { groups: [] },
      page: { totalElements: 0 }
    }));
    apiService.deleteInvoice = vi.fn(() => Promise.resolve());
  });
});
