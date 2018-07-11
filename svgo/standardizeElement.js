exports.type = 'perItem';

exports.active = false;

exports.description = 'standardize element attributes (disabled by default)';

exports.fn = function (item) {
  let tempRX = null;
  let tempRY = null;
  const attrs = [];

  if (item.elem === 'rect') {
    item.eachAttr((attr) => {
      attrs.push(attr);
      if (attr.name === 'rx') {
        tempRX = attr.value;
      } else if (attr.name === 'ry') {
        tempRY = attr.value;
      }
    });

    if (tempRX === null && tempRY !== null) {
      attrs.push({
        name: 'rx',
        value: tempRY,
        prefix: '',
        local: 'rx'
      });
    } else if (tempRX !== null && tempRY === null) {
      attrs.push({
        name: 'ry',
        value: tempRX,
        prefix: '',
        local: 'ry'
      });
    }

    item.attrs = attrs;
  }
};
