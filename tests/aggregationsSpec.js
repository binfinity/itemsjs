'use strict';

var should = require('should');
var expect = require('expect');
var assert = require('assert');
var service = require('./../src/lib');
var sinon = require('sinon')

describe('aggregations', function() {

  var items = [{
    name: 'movie1',
    tags: ['a', 'b', 'c', 'd'],
    actors: ['a', 'b']
  }, {
    name: 'movie2',
    tags: ['a', 'e', 'f'],
    actors: ['a', 'b']
  }, {
    name: 'movie3',
    tags: ['a', 'c'],
    actors: ['e']
  }]


  it('returns buckets', function test(done) {
    // should be search here
    var result = service.aggregations(items, {
      tags: {
        //values: ['Berlin'],
        //conjuction: true,
        //type: 'terms',
        //size: 10
      },
    })
    //console.log(JSON.stringify(result, null, 2));
    assert.equal(result.tags.buckets.length, 6);
    assert.equal(result.tags.buckets[0].key, 'a');
    assert.equal(result.tags.buckets[1].key, 'c');


    done();
  });

  it('returns buckets for two fields (tags, actors)', function test(done) {
    var result = service.aggregations(items, {
      tags: {
      }, actors: {
      },
    })

    assert.equal(result.tags.buckets.length, 6);
    assert.equal(result.tags.buckets[0].key, 'a');
    assert.equal(result.tags.buckets[1].key, 'c');
    assert.equal(result.actors.buckets.length, 3);

    done();
  });

  it('should do nothing with not existent field', function test(done) {
    var result = service.aggregations(items, {
      tags: {
      },
    })

    assert.equal(result.tags.buckets.length, 6);
    //assert.equal(result.param.buckets.length, 0);

    done();
  });

  it('returns buckets tag field with filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: 'c'
      }
    })

    assert.equal(result.tags.buckets.length, 4);

    done();
  });

  it('returns buckets tag field with array filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: ['c']
      }
    })

    assert.equal(result.tags.buckets.length, 4);

    done();
  });

  it('returns buckets tag field with multi array filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: ['e', 'f']
      }
    })

    assert.equal(result.tags.buckets.length, 3);

    done();
  });

  it('returns buckets tag field with multi array filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: ['e', 'f'],
        title: 'Tags',
        conjunction: true
      }
    })

    assert.equal(result.tags.buckets.length, 3);
    assert.equal(result.tags.title, 'Tags');

    done();
  });

  it('returns buckets tag field with multi array filtering and disjunction', function test(done) {

    var spy = sinon.spy(service, 'buckets');
    var result = service.aggregations(items, {
      tags: {
        filters: ['e', 'z'],
        title: 'Tags',
        conjunction: false
      }
    })

    assert.equal(spy.callCount, 1);
    assert.equal(spy.firstCall.args[0].length, 3);
    assert.equal(spy.firstCall.args[1], 'tags');
    assert.equal(spy.firstCall.args[2].conjunction, false);
    assert.deepEqual(spy.firstCall.args[2].filters, ['e', 'z']);
    assert.equal(spy.firstCall.args[3].tags.conjunction, false);
    assert.deepEqual(spy.firstCall.args[3].tags.filters, ['e', 'z']);
    assert.equal(result.tags.buckets.length, 3);
    assert.equal(result.tags.title, 'Tags');
    spy.restore();

    done();
  });

  it('returns aggregations with cross multi array filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: ['e', 'f']
      },
      actors: {
        title: 'Actors',
        //position: 10
      }
    })

    assert.equal(result.tags.buckets.length, 3);
    assert.equal(result.actors.buckets.length, 2);
    assert.equal(result.actors.title, 'Actors');
    //assert.equal(result.actors.position, 10);

    done();
  });

  it('returns aggregations with cross multi array filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: ['e', 'f']
      },
      actors: {
        filters: ['a']
      }
    })

    assert.equal(result.tags.buckets.length, 3);
    assert.equal(result.actors.buckets.length, 2);

    done();
  });

  it('returns aggregations with cross multi array filtering', function test(done) {
    var result = service.aggregations(items, {
      tags: {
        filters: ['e', 'f']
      },
      actors: {
        filters: ['z']
      }
    })

    assert.equal(result.tags.buckets.length, 0);
    assert.equal(result.actors.buckets.length, 0);

    done();
  });

});
