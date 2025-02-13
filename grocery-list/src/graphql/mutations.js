/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGroceryItem = /* GraphQL */ `
  mutation CreateGroceryItem(
    $input: CreateGroceryItemInput!
    $condition: ModelGroceryItemConditionInput
  ) {
    createGroceryItem(input: $input, condition: $condition) {
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
export const updateGroceryItem = /* GraphQL */ `
  mutation UpdateGroceryItem(
    $input: UpdateGroceryItemInput!
    $condition: ModelGroceryItemConditionInput
  ) {
    updateGroceryItem(input: $input, condition: $condition) {
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
export const deleteGroceryItem = /* GraphQL */ `
  mutation DeleteGroceryItem(
    $input: DeleteGroceryItemInput!
    $condition: ModelGroceryItemConditionInput
  ) {
    deleteGroceryItem(input: $input, condition: $condition) {
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
