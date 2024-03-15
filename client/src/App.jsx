import { useState } from 'react';
import { treeFactory } from './utils';

import Navbar from './components/Navbar';
import TreeInputForm from './components/TreeInputForm';
import TreeVisualization from './components/BinaryTreeVisualization';
import Footer from './components/Footer';
import TreeSettings from './components/TreeSettings';

const App = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useState([]);
  const [tree, setTree] = useState(null); // Changed Tree to BinaryTree
  const [activeTreeModel, setActiveTreeModel] = useState(null);
  const [proof, setProof] = useState([]);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [settings, setSettings] = useState({
    maxNodes: 10,
    patriciaPrefix: '',
    animationSpeed: 1,
  });

  const handleTreeModelChange = (model) => {
    setActiveTreeModel(model);
    setNodes([]); // Reset nodes state
    setTree(model ? treeFactory(model.value) : null); // Reset tree state
  };

  const onUpdateSettings = (newSettings) => setSettings(newSettings);

  const onSearch = (searchQuery) => {
    setProof([]);
    setSearchQuery(searchQuery);
  };

  const onRandom = () => {
    console.log(settings.maxNodes)
    if(!activeTreeModel) return null;
    setNodes([]); // Reset nodes state
    const [randomTree, randomNodes] = activeTreeModel?.value === "patricia" ? tree.generateRandomTree(settings.maxNodes, settings.patriciaPrefix) : tree.generateRandomTree(settings.maxNodes);
    setNodes(randomNodes); // Update nodes state
    // Use `randomNodes` directly to generate the new tree
    setTree(randomTree); // Update tree state, changed Tree to BinaryTree
    setSearchQuery(''); // Reset search query
  };

  const onAddNode = (nodeValue) => {
    if (!activeTreeModel) return null;
    if (nodes.length >= settings.maxNodes) return null;
    // Handle binary tree case
    if (activeTreeModel.value === 'binary') {
        const parsedValue = parseFloat(nodeValue);
        if (!isNaN(parsedValue) && !nodes.includes(parsedValue)) {
            const newTree = tree.clone();
            newTree.addNode(parsedValue);

            setNodes([...nodes, parsedValue]);
            setTree(newTree);
            setSearchQuery('');
        } else {
            console.error('Invalid or duplicate numeric value:', nodeValue);
        }
    }
    // Handle Merkle tree case
    else if (activeTreeModel.value === 'merkle') {
        if (typeof nodeValue === 'string' && nodeValue.trim() !== '' && !nodes.includes(nodeValue)) {
            const newTree = tree.clone();
            newTree.addNode(nodeValue.trim());

            setNodes([...nodes, nodeValue.trim()]);
            setTree(newTree);
            setSearchQuery('');
        } else {
            console.error('Invalid or duplicate string value:', nodeValue);
        }
    }
    // Handle Patricia tree case
    else if (activeTreeModel.value === 'patricia') {
        // Patricia trees typically use strings, similar to Merkle trees in this context
        if (typeof nodeValue === 'string' && nodeValue.trim() !== '') {
            const newTree = tree.clone(settings.patriciaPrefix); // Assuming clone method is available and properly implemented
            newTree.insert(nodeValue.trim()); // Assuming addNode is adjusted to work for Patricia trees
            nodeValue = nodeValue.trim().startsWith(settings.patriciaPrefix) ? nodeValue.trim() : settings.patriciaPrefix + nodeValue.trim();
            nodes.includes(nodeValue) ? null : setNodes([...nodes, nodeValue]);
            setTree(newTree);
            setSearchQuery('');
        } else {
            console.error('Invalid or duplicate string value for Patricia tree:', nodeValue);
        }
    }
};


  const onClearNodes = () => {
    setNodes([]); // Reset nodes state
    setTree(activeTreeModel ? treeFactory(activeTreeModel.value) : null); // Reset tree state, changed Tree to BinaryTree
    setSearchQuery(''); // Reset search query
  };

  const onGetProof = (nodeValue) => {
    if (!activeTreeModel) return null;
    if (activeTreeModel.value === 'merkle') {
          const proof = tree.getProof(nodeValue);
          setProof(proof);
          setSearchQuery("");
    }
};

const toggleAnimation = () => {
  setIsAnimationActive(!isAnimationActive);
}

  return (
    <div className='flex flex-col justify-between min-h-screen font-code'>
      <div>
        <Navbar onTreeModelChange={handleTreeModelChange} />
        <TreeInputForm 
          onAddNodes={onAddNode} onRandom={onRandom} nodes={nodes}
          activeTreeModel={activeTreeModel} onClearNodes={onClearNodes}
          onGetProof={onGetProof} onSearch={onSearch} settings={settings}
          ontoggleAnimation={toggleAnimation} isAnimationActive={isAnimationActive}
        />
        <TreeVisualization tree={tree} search={searchQuery} activeTreeModel={activeTreeModel} proof={proof} isAnimationActive={isAnimationActive}/>
        <TreeSettings onUpdateSettings={onUpdateSettings} treeModel={activeTreeModel}/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
