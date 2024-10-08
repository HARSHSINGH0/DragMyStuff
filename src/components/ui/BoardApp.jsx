import React, { useState, useEffect, useRef } from 'react';
import { X, Edit, Trash2, Image, FileText } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent } from './card';

const BoardApp = () => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemFile, setNewItemFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load stored items from local storage at component mount
    const storedItems = localStorage.getItem('boardItems');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    // Save current items to local storage when items state changes
    localStorage.setItem('boardItems', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    // Add a new item either with text content or a file
    if (newItemText.trim() !== '' || newItemFile) {
      const newItem = {
        id: Date.now().toString(),
        content: newItemText.trim() || newItemFile.name,
        type: newItemFile ? (newItemFile.type.startsWith('image/') ? 'image' : 'document') : 'text',
        file: newItemFile,
        filePath: newItemFile ? URL.createObjectURL(newItemFile) : null
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setNewItemText('');
      setNewItemFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const deleteItem = (id) => {
    // Remove item based on its id
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const editItem = (id, newContent) => {
    // Update an item's content based on its id
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, content: newContent } : item))
    );
  };

  const importJSON = (event) => {
    // Import items from a JSON file
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
    // Export current items to a JSON file
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'board_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleDragStart = (event, item) => {
    // Handle drag start depending on item type (file or text)
    if (item.file) {
      const file = new File([item.file], item.content, { type: item.file.type });
      event.dataTransfer.items.add(file);
      event.dataTransfer.effectAllowed = 'copyMove';
    } else {
      event.dataTransfer.setData('text/plain', item.content);
      event.dataTransfer.effectAllowed = 'copyMove';
    }
  };

  const handleFileChange = (id, file) => {
    // Update an item's file and its path
    if (file) {
      const updatedItem = {
        ...items.find(item => item.id === id),
        content: file.name,
        file: file,
        filePath: URL.createObjectURL(file)
      };
      setItems(prevItems => prevItems.map(i => i.id === id ? updatedItem : i));
    }
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
                {item.type === 'document' && <FileText className="mr-2" />}
                {item.type === 'image' || item.type === 'document' ? (
                  <span onClick={() => {
                    // Mock approach for directly handling files, real-world usage on desktop apps
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = item.type === 'image' ? 'image/*' : 'application/pdf';
                    input.onchange = (e) => handleFileChange(item.id, e.target.files[0]);
                    input.click();
                  }}>{item.content}</span>
                ) : (
                  <span>{item.content}</span>
                )}
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
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setNewItemFile(e.target.files[0])}
          className="mr-2 add-draggable-input"
          ref={fileInputRef}
        />
        <Button onClick={addItem} className='add-draggable-submit'>Add Draggable</Button>
      </div>
    </div>
  );
};

export default BoardApp;