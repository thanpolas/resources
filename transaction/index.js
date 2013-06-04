var resource = require('resource'),
    transfer = resource.use('transfer'),
    transaction = resource.define('transaction');

transaction.schema.description = 'for defining inventory transactions';

transaction.property('type', {
  description: 'type of transaction, ie. coin name',
  type: 'string'
});

transaction.property('source', {
  description: 'source of transaction, ie. block hash',
  type: 'string'
});

transaction.property('transfer', {
  description: 'list of transfers in transaction',
  type: 'array',
  items: transfer.schema
});

transaction.property('timestamp', {
  description: 'timestamp of transaction',
  type: 'number'
});

transaction.property('comment', {
  description: 'comment on transaction',
  type: 'string'
});

function init(options, callback) {
  transaction.get(options.id, function(err, tx) {
    if (err) {
      if (err.message === (options.id + " not found")) {
        // transaction does not yet exist, create it
        return transaction.create(options, function(err, result) {
            return callback(null, result);
          });
      }
      else {
        throw err;
      }
    } else if ((tx.type !== options.type) ||
        (tx.source !== options.source)) {
      // a different transaction with same id already exists
      throw "transaction id " + options.id + "already existed!";
    }
    return callback(null, tx);
  });
}
transaction.method('init', init, {
  description: 'initializes a transaction',
  properties: {
    options: transaction.schema,
    callback: {
      type: 'function'
    }
  }
});

exports.transaction = transaction;
exports.dependencies = {
  'decimal': '*'
};
exports.license = "AGPLv3";