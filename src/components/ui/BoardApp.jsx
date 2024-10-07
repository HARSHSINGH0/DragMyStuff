import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Image, FileText } from 'lucide-react';
import { Button } from './button'; // Assume these are your styled Button and Input components
import { Input } from './input'; 
import { Card, CardContent } from './card'; // Assume these are your styled Card components

const BoardApp = () => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    const storedItems = localStorage.getItem('boardItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('boardItems', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItemText.trim() !== '') {
      const newItem = { id: Date.now().toString(), content: newItemText, type: 'text' };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const editItem = (id, newContent) => {
    setItems(items.map((item) => (item.id === id ? { ...item, content: newContent } : item)));
  };

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

  const exportJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'board_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData('text/plain', item.content);
    event.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">LOGO</h1>
        <div>
          <input type="file" accept=".json" onChange={importJSON} className="hidden" id="import-json" />
          <Button onClick={() => document.getElementById('import-json').click()} className="mr-2">
            Import
          </Button>
          <Button onClick={exportJSON}>Export</Button>
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
            <CardContent className="flex justify-between items-center">
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
          placeholder="Add new item"
          className="mr-2"
        />
        <Button onClick={addItem}>+ Add Draggable Text</Button>
      </div>
    </div>
  );
};

export default BoardApp;