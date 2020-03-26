const originalList = [
  { id: 1, name: 'Branch A' },
  { id: 2, name: 'Branch B' },
  { id: 9, name: 'Branch I', pId: 8 },
  { id: 3, name: 'Branch C', pId: 1 },
  { id: 4, name: 'Branch D', pId: 1 },
  { id: 5, name: 'Branch E', pId: 2 },
  { id: 6, name: 'Branch F', pId: 3 },
  { id: 7, name: 'Branch G', pId: 2 },
  { id: 8, name: 'Branch H', pId: 4 },
  { id: 10, name: 'Branch J', pId: 4 },
];

const toTreeList = list => {
  const map = {};
  list.forEach(o => (map[o.id] = o));
  const roots = list.filter(o => !o.pId);
  const errorItems = [];
  list.forEach(item => {
    const { id, pId } = item;
    // console.log('item', item);
    const parent = map[pId];
    // console.log(item, parent);
    if (!!parent) {
      parent.children = [...(parent.children || []), item];
    } else {
      // console.error('Error item:', item);
      errorItems.push(item);
    }
  });
  return roots;
};

const toPathList = treeList => {
  const calcPath = (path, id) => path ? `${path}${id}-` : `-${id}-`;
  const addPath = path => item => ({...item, path: calcPath(path, item.id)});
  const flatten = (childrenList, path) => {
    let res = [];
    (childrenList || []).forEach(child => {
      res = [
        ...res,
        addPath(path)(child),
        ...flatten(child.children, calcPath(path, child.id)),
      ];
    });
    return res;
  };
  const result = flatten(treeList);
  result.forEach(item => delete item.children);
  return result;
};

const generatePathFieldValues = (pathList, fields = [])=> {
  const map = {};
  pathList.forEach(o => (map[o.id] = o));
  const extract = item => pId => {
    fields.forEach(fName => {
      const targetFiledName = `${fName}PathValue`;
      item[targetFiledName] = `${
        item[targetFiledName] ? `${item[targetFiledName]} , ` : ''
      }${map[pId][fName]}`;
    });
    return item;
  }
  return pathList.map(item => {
    item.path.split('-').filter(p => !!p && map[p]).forEach(extract(item));
    return item;
  });
};

const treeList = toTreeList(originalList);
console.log(JSON.stringify(treeList));
const pathList = toPathList(treeList);
console.log(pathList);
const pathWithNameList = generatePathFieldValues(pathList, ['name']);
console.log(JSON.stringify(pathWithNameList));
