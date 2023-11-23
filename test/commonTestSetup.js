import { config, mount } from '@vue/test-utils';
import Vuetify from "./plugins/vuetify";
import store from '@/store';

export const mockTranslation = () => {
  config.global.mocks.$t = (i) => i;
};

// Create wrapper
export const createTestWrapper = (component = {}, props = {}) => {
  return mount(component, {
    global: {
      plugins: [Vuetify, store],
    },
    props
  });
};

export const createClientEntity = (id, username, password, fullName, status) => ({
  id,
  username,
  password,
  fullName,
  status,
  phoneNumber: "+123456789",
  addressText: `Address ${id}`,
  longitude: "-118.243683",
  latitude: "34.052235",
  cityId: 2,
  radUserGroups: []
});

export const mockClientResponse = (clients) => ({
  "_embedded": {
    "clients": clients
  },
  "_links": {
    "self": {
      "href": "http://localhost:8100/api/clients/search/searchClients"
    }
  },
  "page": {
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "number": 0
  }
});

export const mockCityResponse = {
  _embedded: {
    cities: [
      {id: 1, name: 'CITY 1'},
      {id: 2, name: 'CITY 2'},
    ],
  },
  page: {
    totalPages: 1,
    totalElements: 2,
  },
};

export function createNASEntity(id, nasName, type, server) {
  return {
    id: id,
    nasName: nasName,
    type: type,
    server: server
  };
}

export function mockNASResponse(nas) {
  return {
    _embedded: {
      nas,
    },
    page: {
      totalElements: nas.length,
      totalPages: 1,
      size: nas.length,
      number: 0
    }
  };
}

export function createRadGroupCheckEntity(id, groupName, operator, value) {
  return {
    id: id,
    groupName: groupName,
    attribute: "SomeAttribute",  // You can change this or add it as an argument if different values are needed.
    operator: operator,
    value: value,
    _links: {
      self: {
        href: `http://localhost:8100/api/radgroupcheck/${id}`
      },
      radGroupCheckEntity: {
        href: `http://localhost:8100/api/radgroupcheck/${id}`
      }
    }
  };
}

export function createGroup(id, groupName) {
  return {
    id: id,
    groupName: groupName
  };
}

export function createRadCheckEntity(id, username, operator, value) {
  return {
    id: id,
    username: username,
    attribute: "SomeAttribute",  // You can change this or add it as an argument if different values are needed.
    operator: operator,
    value: value,
    _links: {
      self: {
        href: `http://localhost:8100/api/radcheck/${id}`
      },
      radGroupCheckEntity: {
        href: `http://localhost:8100/api/radcheck/${id}`
      }
    }
  };
}
export function createRadReplyEntity(id, username, operator, value) {
  return {
    id: id,
    username: username,
    attribute: "SomeAttribute",  // You can change this or add it as an argument if different values are needed.
    operator: operator,
    value: value,
    _links: {
      self: {
        href: `http://localhost:8100/api/radcheck/${id}`
      },
      radGroupCheckEntity: {
        href: `http://localhost:8100/api/radcheck/${id}`
      }
    }
  };
}

export function createRadGroupReplyEntity(id, groupName, operator, value) {
  return {
    id: id,
    groupName: groupName,
    attribute: "SomeAttribute",  // You can change this or add it as an argument if different values are needed.
    operator: operator,
    value: value,
    _links: {
      self: {
        href: `http://localhost:8100/api/radgroupreply/${id}`
      },
      radGroupReplyEntity: {
        href: `http://localhost:8100/api/radgroupreply/${id}`
      }
    }
  };
}

export function mockRadGroupCheckResponse(radGroupChecks) {
  return {
    "_embedded": {
      "radgroupcheck": radGroupChecks
    },
    "_links": {
      "self": {
        "href": `http://localhost:8100/api/radgroupcheck/search/findByGroupNameIgnoreCase?page=0&size=${radGroupChecks.length}`
      }
    },
    "page": {
      "size": radGroupChecks.length,
      "totalElements": radGroupChecks.length,
      "totalPages": 1,
      "number": 0
    }
  };
}

export function mockRadGroupResponse(radGroupChecks) {
  return {
    "_embedded": {
      "groups": radGroupChecks
    },
    "page": {
      "size": radGroupChecks.length,
      "totalElements": radGroupChecks.length,
      "totalPages": 1,
      "number": 0
    }
  };
}

export function mockRadGroupReplyResponse(radGroupReplies) {
  return {
    "_embedded": {
      "radgroupreply": radGroupReplies
    },
    "_links": {
      "self": {
        "href": `http://localhost:8100/api/radgroupreply/search/findByGroupNameIgnoreCase?page=0&size=${radGroupReplies.length}`
      }
    },
    "page": {
      "size": radGroupReplies.length,
      "totalElements": radGroupReplies.length,
      "totalPages": 1,
      "number": 0
    }
  };
}

