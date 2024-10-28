import './App.css';
import { useState } from 'react';

const initialFileStructure = {
  src: {
    components: {
      "Header.js": {},
      "Footer.js": {},
    },
    "App.js": {},
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

  const isFolder = children && Object.keys(children).length > 0;
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
        {isFolder ? (isOpen ? '📂' : '📁') : '📄'} {name}
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

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setFileContent(`File Content: [${node.split('/').pop()}]`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
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
      <div style={{ marginLeft: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h3>File Content</h3>
        <p>{fileContent}</p>
      </div>
    </div>
  );
}

export default App;
