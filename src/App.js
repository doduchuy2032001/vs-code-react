import './App.css';
import { useState } from 'react';

const fileStructure = {
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

const FileNode = ({ name, children, level, selectedNode, setSelectedNode, path }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    setSelectedNode(path);
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  return (
    <div>
      {Object.keys(fileStructure).map((key) => (
        <FileNode
          key={key}
          name={key}
          children={fileStructure[key]}
          level={1}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          path={key}
        />
      ))}
    </div>
  );
}

export default App;
