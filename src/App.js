import './App.css';
import { useState } from 'react';

const initialFileStructure = {
  src: {
    components: {
      "Header.js": {
        title: "This is header content"
      },
      "Footer.js": {
         title: "This is footer content"
      },
    },
    "App.js": {
      title: "This is App Content"
    },
    "index.js": {},
  },
  public: {
    "index.html": {},
    "favicon.ico": {},
  },
  "README.md": {},
};

const FileNode = ({ name, children, level, selectedNode, setSelectedNode, path, addNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    setSelectedNode(path); 
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    const nodeName = prompt("Enter folder/file name:");
    if (nodeName) {
      addNode(path, nodeName);
    }
  };

  const isFolder = children && Object.keys(children).length >= 0 && !/[.,]/.test(name) ;
  const levelClass = `level-${level}`;
  const isSelected = selectedNode === path;

  return (
    <div className={`file-node ${levelClass}`}>
      <div
        onClick={() => {
          handleToggle();
          handleSelect();
        }}
        onContextMenu={handleRightClick}
        className={isFolder ? 'folder' : 'file'}
        style={{
          backgroundColor: isSelected ? '#ddd' : 'transparent',
        }}
      >
        {isFolder && (isOpen ? '▼' : '►')}
        <span style={{ marginLeft: isFolder ? '5px' : '20px' }}>
          {isFolder ? (isOpen ? '📂' : '📁') : '📄'} {name}
        </span>
      </div>
      {isOpen && isFolder && (
        <div className="file-content">
          {Object.keys(children).map((child) => (
            <FileNode
              key={child}
              name={child}
              children={children[child]}
              level={level + 1}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              path={`${path}/${child}`}
              addNode={addNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [fileStructure, setFileStructure] = useState(initialFileStructure);
  const [selectedNode, setSelectedNode] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const addNode = (path, nodeName) => {
    const pathParts = path.split('/');
    const newStructure = { ...fileStructure };

    let current = newStructure;
    pathParts.forEach(part => {
      current = current[part];
    });

    if (!current[nodeName]) {
      current[nodeName] = {};
      setFileStructure(newStructure);
    }
  };

  const getNodeContent = (structure, path) => {
    const pathParts = path.split('/');
    let current = structure;
    for (const part of pathParts) {
      if (current[part]) {
        current = current[part];
      } else {
        return "Content not found";
      }
    }
    return Object.keys(current).length ? current?.title : "This file is empty";
  };
  
  const handleSelectNode = (node) => {
    setSelectedNode(node);
    const content = getNodeContent(fileStructure, node);
    setFileContent(content);
  };

  return (
    <div className='main'>
      <div className='header'>
        <p className='header-title'>Visual Studio Code</p>
      </div>
      <div className='body-content'>
        <div className='sidebar'>
          {Object.keys(fileStructure).map((key) => (
            <FileNode
              key={key}
              name={key}
              children={fileStructure[key]}
              level={1}
              selectedNode={selectedNode}
              setSelectedNode={handleSelectNode}
              path={key}
              addNode={addNode}
            />
          ))}
        </div>
        <div className='file-content-body'>
          <div>
            <h3>File Content</h3>
            <p>{fileContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
