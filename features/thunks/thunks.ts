import axios from "axios";
import { GraphQLClient, gql } from 'graphql-request'

export const getData = async (endpoint: string, token: string, filters: any) => {
    const url = process.env.BASE_URL + endpoint;
    const response = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        params: filters
    });
    return response;
};

export const createData = async (endpoint: string, data: any, token: string) => {
  const url = process.env.BASE_URL + endpoint;
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateData = async (endpoint: string, data: any, token: string) => {
  const url = process.env.BASE_URL + endpoint;
  const response = await axios.put(url, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const graphqlGetClients = async (token: string, endpoint: string, filters: any) => {
    const url = process.env.BASE_URL + endpoint;
   
    const graphQLClient = new GraphQLClient(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      jsonSerializer: {
        parse: JSON.parse,
        stringify: JSON.stringify,
      },
    })
  
    const query = gql`
    {
      clients(sort: {${filters.sortBy} : ${filters.sortOrder}}, limit: ${filters.limit}, offset: ${filters.offset}) {
        results {id name email invoicesCount totalBilled companyDetails {name}} total
      }
    }
    `;
  
   return await graphQLClient.request(query)
  }