/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGroceryItem = /* GraphQL */ `
  query GetGroceryItem($id: ID!) {
    getGroceryItem(id: $id) {
      id
      name
      quantity
      purchased
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGroceryItems = /* GraphQL */ `
  query ListGroceryItems(
    $filter: ModelGroceryItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroceryItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        quantity
        purchased
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
