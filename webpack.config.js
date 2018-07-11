module.exports = [{
  entry: {
    bbia_frameworks_create_entry: 'test',
  },
}, {
  entry: {
    plain: 'plain',
  },
}, {
  entry: 'server',
}];

if (require.main === module) {
  console.info(module.exports);
}
