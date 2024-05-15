import newman from 'newman';
import collection from './salesforceauth.postman_collection.json' assert { type: 'json' };

newman.run({
    collection: collection,
    reporters: 'cli'
}, function (err) {
    if (err) { throw err; }
    console.log('collection run complete!');
});
