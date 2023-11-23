import {API_CONFIG} from '@/config.js';
import http from "@/http";

export const apiService = {
  ///Cities
  async addCity(city) {
    return http.post(API_CONFIG.cityEndpoint, city);
  },
  async fetchCities() {
    return http.get(`${API_CONFIG.cityEndpoint}/search/findAllByOrderByNameAsc`)
  },
  async getCities() {
    return http.get(API_CONFIG.cityEndpoint)
  },
  async fetchCityById(id) {
    return http.get(`${API_CONFIG.cityEndpoint}/${id}`)
  },
  async updateCity(id, city) {
    return http.put(`${API_CONFIG.cityEndpoint}/${id}`, city);
  },
  async deleteCity(id) {
    await http.delete(`${API_CONFIG.cityEndpoint}/${id}`).catch(error => {throw error});
  },

  ///AUTH
  async login(username, password) {
    return http.post(`/auth/login`, {
      username: username,
      password: password,
    })
  },

  ///Configuration
  async getConfigurationSettings() {
    return http.get(`${API_CONFIG.settingsEndpoint}`)
  },
  async saveConfigurationSettings(settings) {
    return http.put(`${API_CONFIG.settingsEndpoint}`, settings)
  },

  ///Users
  searchUsers(filters, page, itemsPerPage) {
    return http.get(`${API_CONFIG.users}/search/searchUsers?page=${page - 1}&size=${itemsPerPage}`, {
      params: Object.entries(filters)
          .filter(([key, value]) => key != null && value && value.trim() !== "")
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    })
  },
  deleteUser(id) {
    return http.delete(`${API_CONFIG.users}/${id}`)
  },
  getUser(id) {
    return http.get(`${API_CONFIG.users}/${id}`);
  },
  addUser(user) {
    return http.post(API_CONFIG.users, user);
  },
  updateUser(id, user) {
    return http.put(`${API_CONFIG.users}/${id}`, user);
  },

  
  ///Clients
  async getClientList(filters, page, itemsPerPage) {
    return http.get(`${API_CONFIG.clientEndpoint}/search/searchClients?page=${page - 1}&size=${itemsPerPage}`, {
      params: Object.entries(filters)
          .filter(([key, value]) => key != null && value && value.trim() !== "")
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    })
  },
  getClient(id) {
    return http.get(`${API_CONFIG.clientEndpoint}/${id}`);
  },
  addClient(client) {
    return http.post(API_CONFIG.clientEndpoint, client);
  },
  updateClient(id, client) {
    return http.put(`${API_CONFIG.clientEndpoint}/${id}`, client);
  },
  deleteClient(id) {
    return http.delete(`${API_CONFIG.clientEndpoint}/${id}`)
  },
  getUsersNotInGroup(groupName, search, pageLimit, cancelToken) {
    return http.get(`${API_CONFIG.radcheck}/search/findUsersNotInGroup`, {
      cancelToken: cancelToken,
      params: {
        groupName: groupName,
        username: search,
        size: pageLimit + 1
      }
    })
  },

  ///RadCheck attributes
  getRadCheckAttributes(username, page, itemsPerPage) {
    return http.get(`${API_CONFIG.radcheck}/search/findByUsernameIgnoreCase`, {
      params: {
        username: username,
        page: page - 1,
        size: itemsPerPage
      }
    })
  },
  addRadCheckAttribute(username, attributeName, operator, value) {
    return http.post(API_CONFIG.radcheck, {
      username: username,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  updateRadCheckAttribute(id, username, attributeName, operator, value) {
    return http.put(`${API_CONFIG.radcheck}/${id}`, {
      username: username,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  deleteRadCheckAttributes(selectedAttributes) {
    return http.delete(`${API_CONFIG.radcheck}/bulk/delete`, {
      data: selectedAttributes
    })
  },

  ///RadReply attributes
  getRadReplyAttributes(username, page, itemsPerPage) {
    return http.get(`${API_CONFIG.radreply}/search/findByUsernameIgnoreCase`, {
      params: {
        username: username,
        page: page - 1,
        size: itemsPerPage
      }
    })
  },
  addRadReplyAttribute(username, attributeName, operator, value) {
    return http.post(API_CONFIG.radreply, {
      username: username,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  updateRadReplyAttribute(id, username, attributeName, operator, value) {
    return http.put(`${API_CONFIG.radreply}/${id}`, {
      username: username,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  deleteRadReplyAttributes(selectedAttributes) {
    return http.delete(`${API_CONFIG.radreply}/bulk/delete`, {
      data: selectedAttributes
    })
  },

  //Group users
  findGroupsByUsername(username, page, pageSize) {
    return http.get(`${API_CONFIG.radusergroups}/search/findByUsernameIgnoreCase`, {
      params: {
        username: username,
        page: page - 1,
        size: pageSize
      }
    })
  },
  addUserToGroup(group, username) {
    return http.post(`${API_CONFIG.radusergroups}`, {
      groupName: group,
      username: username
    })
  },
  removeUserFromGroups(selectedUserGroups) {
    return http.delete(`${API_CONFIG.radusergroups}/bulk/delete`, {
      data: selectedUserGroups
    })
  },
  findGroupsNotAssignedToUser(username, search, pageLimit, cancelToken) {
    return http.get(`${API_CONFIG.radgroupcheck}/search/findGroupsNotAssignedToUser`, {
      cancelToken: cancelToken,
      params: {
        username: username,
        groupName: search,
        size: pageLimit + 1
      }
    })
  },
  getClientInvoices(clientId, page, pageSize) {
    return http.get(`${API_CONFIG.invoices}/search/findByClientIdOrderByGeneratedAtDesc`, {
      params: {
        clientId: clientId,
        page: page - 1,
        size: pageSize
      }
    })
  },
  getLatestClientInvoices(clientId, page, pageSize) {
    return http.get(`${API_CONFIG.invoices}/search/findByClientIdAndStatusInOrderByGeneratedAtDesc`, {
      params: {
        clientId: clientId,
        statuses: 'PENDING,PARTIALLY_PAID',
        page: page - 1,
        size: pageSize
      }
    })
  },
  payClientInvoice(clientId, paymentAmount) {
    return http.put(`${API_CONFIG.invoices}/pay?clientId=${clientId}&paidAmount=${paymentAmount}`)
  },
  getClientsByFullName(search, pageLimit, cancelToken) {
    return http.get(`${API_CONFIG.clientEndpoint}/search/findByFullNameContainsIgnoreCase`, {
      cancelToken: cancelToken,
      params: {
        fullName: search,
        size: pageLimit + 1
      }
    })
  },
  
  
  ///Groups
  searchGroups(groupName, page, itemsPerPage) {
    return http.get(`${API_CONFIG.radgroups}/search/findByGroupNameIgnoreCase`, {
      params: {
        groupName: groupName,
        page: page - 1,
        size: itemsPerPage
      }
    })
  },
  deleteGroup(id) {
    return http.delete(`${API_CONFIG.radgroups}/${id}`)
  },
  getGroup(id) {
    return http.get(`${API_CONFIG.radgroups}/${id}`);
  },
  addGroup(group) {
    return http.post(API_CONFIG.radgroups, group);
  },
  updateGroup(id, group) {
    return http.put(`${API_CONFIG.radgroups}/${id}`, group);
  },
  getUsersInGroup(groupName, page, pageSize) {
    return http.get(`${API_CONFIG.radusergroups}/search/findByGroupNameIgnoreCase`, {
      params: {
        groupName: groupName,
        page: page - 1,
        size: pageSize
      }
    })
  },
  deleteUsersFromGroup(selectedUsers) {
    return http.delete(`${API_CONFIG.radusergroups}/bulk/delete`, {
      data: selectedUsers
    })
  },

  ///NAS
  searchNAS(filters, page, itemsPerPage) {
    return http.get(`${API_CONFIG.nas}/search/searchNas?page=${page - 1}&size=${itemsPerPage}`, {
      params: Object.entries(filters)
          .filter(([key, value]) => key != null && value && value.trim() !== "")
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    })
  },
  deleteNAS(id) {
    return http.delete(`${API_CONFIG.nas}/${id}`)
  },
  getNAS(id) {
    return http.get(`${API_CONFIG.nas}/${id}`);
  },
  addNAS(nas) {
    return http.post(API_CONFIG.nas, nas);
  },
  updateNAS(id, nas) {
    return http.put(`${API_CONFIG.nas}/${id}`, nas);
  },



  ///Group replies
  getGroupReplyByGroupName(groupName, page, pageSize) {
    return http.get(`${API_CONFIG.radgroupreply}/search/findByGroupNameIgnoreCase`, {
      params: {
        groupName: groupName,
        page: page - 1,
        size: pageSize
      }
    })
  },
  addGroupReply(groupName, attributeName, operator, value) {
    return http.post(`${API_CONFIG.radgroupreply}`, {
      groupName: groupName,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  updateGroupReply(id, groupName, attributeName, operator, value) {
    return http.put(`${API_CONFIG.radgroupreply}/${id}`, {
      id: id,
      groupName: groupName,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  deleteGroupReplies(selectedReplies) {
    return http.delete(`${API_CONFIG.radgroupreply}/bulk/delete`, {
      data: selectedReplies
    })
  },

  ///Group checks
  getGroupCheckByGroupName(groupName, page, pageSize) {
    return http.get(`${API_CONFIG.radgroupcheck}/search/findByGroupNameIgnoreCase`, {
      params: {
        groupName: groupName,
        page: page - 1,
        size: pageSize
      }
    })
  },
  addGroupCheck(groupName, attributeName, operator, value) {
    return http.post(`${API_CONFIG.radgroupcheck}`, {
      groupName: groupName,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  updateGroupCheck(id, groupName, attributeName, operator, value) {
    return http.put(`${API_CONFIG.radgroupcheck}/${id}`, {
      id: id,
      groupName: groupName,
      attribute: attributeName,
      operator: operator,
      value: value
    })
  },
  deleteGroupChecks(selectedChecks) {
    return http.delete(`${API_CONFIG.radgroupcheck}/bulk/delete`, {
      data: selectedChecks
    })
  },

  ///Dictionary
  getDictionaryAttributes(search, pageLimit, cancelToken) {
    return http.get(`${API_CONFIG.dictionary}/attributes/search/findByName`, {
      cancelToken: cancelToken,
      params: {
        attribute: search,
        size: pageLimit + 1,
        page: 0
      }
    })
  },


  ///Invoicing
  searchInvoices(filters, page, itemsPerPage) {
    return http.get(`${API_CONFIG.invoices}/search/searchInvoices?page=${page - 1}&size=${itemsPerPage}`, {
      params: Object.entries(filters)
          .filter(([key, value]) => key != null && value && value.trim() !== "")
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    })
  },
  deleteInvoice(id) {
    return http.delete(`${API_CONFIG.invoices}/${id}`)
  },
  getInvoice(id) {
    return http.get(`${API_CONFIG.invoices}/${id}`);
  },
  addInvoice(invoice) {
    return http.post(API_CONFIG.invoices, invoice);
  },
  updateInvoice(id, invoice) {
    return http.put(`${API_CONFIG.invoices}/${id}`, invoice);
  },
  adjustInvoice(invoiceId, adjustmentAmount) {
    return http.put(`${API_CONFIG.invoices}/adjust?invoiceId=${invoiceId}&amount=${adjustmentAmount}`)
  },
  payInvoice(clientId, adjustmentAmount) {
    return http.put(`${API_CONFIG.invoices}/pay?clientId=${clientId}&paidAmount=${adjustmentAmount}`)
  },







  ///Generic add
  genericAdd(endpoint, entity) {
    if (endpoint === API_CONFIG.clientEndpoint) {
      return this.addClient(entity)
    } else if (endpoint === API_CONFIG.invoices) {
      return this.addInvoice(entity)
    } else if (endpoint === API_CONFIG.radgroups) {
      return this.addGroup(entity)
    } else if (endpoint === API_CONFIG.nas) {
      return this.addNAS(entity)
    } else if (endpoint === API_CONFIG.users) {
      return this.addUser(entity)
    }
  },
  genericUpdate(endpoint, entity, id) {
    if (endpoint === API_CONFIG.clientEndpoint) {
      return this.updateClient(id, entity)
    } else if (endpoint === API_CONFIG.invoices) {
      return this.updateInvoice(id, entity)
    } else if (endpoint === API_CONFIG.radgroups) {
      return this.updateGroup(id, entity)
    } else if (endpoint === API_CONFIG.nas) {
      return this.updateNAS(id, entity)
    } else if (endpoint === API_CONFIG.users) {
      return this.updateUser(id, entity)
    }
  },
  genericGet(endpoint, id) {
    if (endpoint === API_CONFIG.clientEndpoint) {
      return this.getClient(id)
    } else if (endpoint === API_CONFIG.invoices) {
      return this.getInvoice(id)
    } else if (endpoint === API_CONFIG.radgroups) {
      return this.getGroup(id)
    } else if (endpoint === API_CONFIG.nas) {
      return this.getNAS(id)
    } else if (endpoint === API_CONFIG.users) {
      return this.getUser(id)
    }
  },
};
