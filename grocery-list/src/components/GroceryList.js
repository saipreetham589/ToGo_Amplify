import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import awsExports from '../aws-exports.js';
import { listGroceryItems } from '../graphql/queries.js';
import { createGroceryItem, updateGroceryItem, deleteGroceryItem } from '../graphql/mutations.js';
import './GroceryList.css'; // Import the CSS file

Amplify.configure(awsExports);
const client = generateClient();

export default function GroceryList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchGroceries();
  }, []);

  async function fetchGroceries() {
    try {
      const result = await client.graphql({ query: listGroceryItems });
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
        variables: { input: { name: newItem, quantity: 1, purchased: false, createdAt: new Date().toISOString() } },
      });
      setItems([...items, result.data.createGroceryItem]);
      setNewItem('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  async function togglePurchased(id, purchased) {
    try {
      await client.graphql({ query: updateGroceryItem, variables: { input: { id, purchased: !purchased } } });
      fetchGroceries();
    } catch (error) {
      console.error('Error toggling purchased status:', error);
    }
  }

  async function adjustQuantity(id, quantity) {
    try {
      await client.graphql({ query: updateGroceryItem, variables: { input: { id, quantity } } });
      fetchGroceries();
    } catch (error) {
      console.error('Error adjusting quantity:', error);
    }
  }

  async function removeItem(id) {
    try {
      await client.graphql({ query: deleteGroceryItem, variables: { input: { id } } });
      fetchGroceries();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  return (
    <div className="grocery-container">
      <h1 className="grocery-title">Grocery List</h1>
      <div className="grocery-input-container">
        <input 
          type="text" 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)} 
          placeholder="Add a new item" 
          className="grocery-input"
        />
        <button onClick={addItem} className="grocery-button">Add</button>
      </div>
      <ul className="grocery-list">
        {items.map((item) => (
          <li key={item.id} className="grocery-item">
            <div>
              <input 
                type="checkbox" 
                checked={item.purchased} 
                onChange={() => togglePurchased(item.id, item.purchased)} 
              />
              <span className={`item-name ${item.purchased ? 'line-through text-gray-500' : ''}`}>
                {item.name} ({item.quantity})
              </span>
              <div className="item-time">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
            <div className="grocery-buttons">
              <button onClick={() => adjustQuantity(item.id, item.quantity - 1)} className="quantity-btn">-</button>
              <button onClick={() => adjustQuantity(item.id, item.quantity + 1)} className="quantity-btn">+</button>
              <button onClick={() => removeItem(item.id)} className="delete-btn">🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
