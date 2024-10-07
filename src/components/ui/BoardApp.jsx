import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Image, FileText } from 'lucide-react';
import { Button } from './button'; // Assume these are your styled Button and Input components
import { Input } from './input'; 
import { Card, CardContent } from './card'; // Assume these are your styled Card components

const BoardApp = () => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  // Load items from local storage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem('boardItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save items to local storage whenever items change
  useEffect(() => {
    localStorage.setItem('boardItems', JSON.stringify(items));
  }, [items]);

  // Add new item
  const addItem = () => {
    if (newItemText.trim() !== '') {
      const newItem = { id: Date.now().toString(), content: newItemText, type: 'text' };
      setItems((prevItems) => [...prevItems, newItem]);
      setNewItemText('');
    }
  };

  // Delete item
  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Edit item
  const editItem = (id, newContent) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, content: newContent } : item))
    );
  };

  // Import JSON file
  const importJSON = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedItems = JSON.parse(e.target.result);
        setItems(importedItems);
      } catch (error) {
        console.error('Error importing JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  // Export items to JSON file
  const exportJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'board_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement); // Append to the document
    linkElement.click();
    document.body.removeChild(linkElement); // Clean up
  };

  // Handle drag start event
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData('text/plain', item.content);
    event.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className="p-4 main">
      <div className="flex justify-between items-center mb-4 header">
        <img src="DragMyStuffLogo.png" alt="" className='header-logo'/>
        <div className='content'>
          <div className='features'>
            <Button onClick={() => window.location.href = 'https://github.com/HARSHSINGH0'}>
              <img className='h-10' src="/icons/githublogo.svg" alt="" />
              <p>Github</p>
            </Button>
            <Button onClick={() => window.location.href = 'https://buymeacoffee.com/confusedbond'} >
              <img className='h-10' src="/icons/buymecoffee.svg" alt="" />               
                <p className='hide-desktop'> Buy me a Coffee</p>
                <p className='hide-mobile'> Coffee</p>
            </Button>
          </div>
          <div className='others'>          
            <Button onClick={() => setItems([])} >
              <img src="/icons/clear.svg" alt="" />
              <span className='hide-desktop'>Clear All</span>
              <span className='hide-mobile'>Clear</span>
            </Button>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" id="import-json" />
            <Button onClick={() => document.getElementById('import-json').click()} >
              <img className='h-10' src="/icons/import.svg" alt="" />
              <p>Import</p>
            </Button>
            <Button onClick={exportJSON}>
              <img className='h-10' src="/icons/export.svg" alt="" />
              <p>Export</p>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-4"
            draggable
            onDragStart={(event) => handleDragStart(event, item)}
          >
            <CardContent className="flex justify-between items-center" style={{ whiteSpace: 'pre-wrap' }}>
              <div className="flex items-center">
                {item.type === 'image' && <Image className="mr-2" />}
                {item.type === 'pdf' && <FileText className="mr-2" />}
                <span>{item.content}</span>
              </div>
              <div>
                <Button onClick={() => {
                  const newContent = prompt('Edit item:', item.content);
                  if (newContent !== null) editItem(item.id, newContent);
                }} className="mr-2">
                  <Edit size={16} />
                </Button>
                <Button onClick={() => deleteItem(item.id)} variant="destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex">
        <Input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addItem();
            }
          }}
          placeholder="Add new item"
          className="mr-2 add-draggable-input"
        />
        <Button onClick={addItem} className='add-draggable-submit'>Add Draggable</Button>
      </div>
    </div>
  );
};

export default BoardApp;
