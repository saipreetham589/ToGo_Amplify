import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import awsExports from '../aws-exports.js';
import { listGroceryItems } from '../graphql/queries.js';
import { createGroceryItem, updateGroceryItem, deleteGroceryItem } from '../graphql/mutations.js';

// Configure Amplify
Amplify.configure(awsExports);

// Generate API client
const client = generateClient();

export default function GroceryList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Fetch grocery items on component mount
  useEffect(() => {
    fetchGroceries();
  }, []);

  async function fetchGroceries() {
    try {
      const result = await client.graphql({
        query: listGroceryItems,
      });
      setItems(
        result.data.listGroceryItems.items.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      );
    } catch (error) {
      console.error('Error fetching grocery items:', error);
    }
  }

  async function addItem() {
    if (!newItem) return;

    try {
      const result = await client.graphql({
        query: createGroceryItem,
        variables: {
          input: {
            name: newItem,
            quantity: 1,
            purchased: false,
            createdAt: new Date().toISOString(),
          },
        },
      });
      setItems([...items, result.data.createGroceryItem]);
      setNewItem('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  async function togglePurchased(id, purchased) {
    try {
      await client.graphql({
        query: updateGroceryItem,
        variables: {
          input: { id, purchased: !purchased },
        },
      });
      fetchGroceries();
    } catch (error) {
      console.error('Error toggling purchased status:', error);
    }
  }

  async function adjustQuantity(id, quantity) {
    try {
      await client.graphql({
        query: updateGroceryItem,
        variables: {
          input: { id, quantity },
        },
      });
      fetchGroceries();
    } catch (error) {
      console.error('Error adjusting quantity:', error);
    }
  }

  async function removeItem(id) {
    try {
      await client.graphql({
        query: deleteGroceryItem,
        variables: {
          input: { id },
        },
      });
      fetchGroceries();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Grocery List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new item"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={() => togglePurchased(item.id, item.purchased)}
              className="w-4 h-4"
            />
            <span
              className={
                item.purchased ? 'line-through text-gray-500' : ''
              }
            >
              {item.name} ({item.quantity})
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  adjustQuantity(item.id, item.quantity - 1)
                }
                className="bg-gray-300 px-2 py-1 rounded"
              >
                -
              </button>
              <button
                onClick={() =>
                  adjustQuantity(item.id, item.quantity + 1)
                }
                className="bg-gray-300 px-2 py-1 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
