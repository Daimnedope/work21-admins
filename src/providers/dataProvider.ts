import type { DataProvider, CrudFilters, CrudSorting } from "@refinedev/core";
import axios from "axios";

const generateFilters = (filters?: CrudFilters): Record<string, unknown> => {
  const queryFilters: Record<string, unknown> = {};

  if (filters) {
    filters.forEach((filter) => {
      if ("field" in filter && filter.value !== undefined && filter.value !== null && filter.value !== "") {
        queryFilters[filter.field] = filter.value;
      }
    });
  }

  return queryFilters;
};

const generateSorting = (sorters?: CrudSorting): Record<string, string> => {
  const sorting: Record<string, string> = {};

  if (sorters && sorters.length > 0) {
    sorting.sort_by = sorters[0].field;
    sorting.sort_order = sorters[0].order;
  }

  return sorting;
};

export const dataProvider = (apiUrl: string): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { current = 1, pageSize = 20 } = pagination ?? {};

    const params: Record<string, unknown> = {
      page: current,
      per_page: pageSize,
      ...generateFilters(filters),
      ...generateSorting(sorters),
    };

    try {
      const { data } = await axios.get(`${apiUrl}/admin/${resource}`, { params });

      return {
        data: data.items || data,
        total: data.total || data.length || 0,
      };
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },

  getOne: async ({ resource, id }) => {
    const { data } = await axios.get(`${apiUrl}/admin/${resource}/${id}`);
    return { data };
  },

  create: async ({ resource, variables }) => {
    const { data } = await axios.post(`${apiUrl}/admin/${resource}`, variables);
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await axios.patch(`${apiUrl}/admin/${resource}/${id}`, variables);
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await axios.delete(`${apiUrl}/admin/${resource}/${id}`);
    return { data };
  },

  getMany: async ({ resource, ids }) => {
    const responses = await Promise.all(
      ids.map((id) => axios.get(`${apiUrl}/admin/${resource}/${id}`))
    );
    return {
      data: responses.map((response) => response.data),
    };
  },

  createMany: async ({ resource, variables }) => {
    const responses = await Promise.all(
      variables.map((vars) => axios.post(`${apiUrl}/admin/${resource}`, vars))
    );
    return {
      data: responses.map((response) => response.data),
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const responses = await Promise.all(
      ids.map((id) => axios.patch(`${apiUrl}/admin/${resource}/${id}`, variables))
    );
    return {
      data: responses.map((response) => response.data),
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const responses = await Promise.all(
      ids.map((id) => axios.delete(`${apiUrl}/admin/${resource}/${id}`))
    );
    return {
      data: responses.map((response) => response.data),
    };
  },

  getApiUrl: () => apiUrl,

  custom: async ({ url, method, payload, query }) => {
    // Если URL абсолютный (начинается с http), используем его напрямую
    let requestUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

    if (query) {
      const params = new URLSearchParams(query as Record<string, string>);
      requestUrl = `${requestUrl}?${params}`;
    }

    const { data } = await axios({
      method,
      url: requestUrl,
      data: payload,
    });

    return { data };
  },
});

