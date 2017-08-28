'use strict'

var assert = require('assert')
var actionPlan = require('./index')

describe('module', function () {
  describe('exports', function () {
    it('should be a function to create a reducer for a named action.', function () {
      assert.equal(typeof actionPlan, 'function')
    })
    it('should have function createAction.', function () {
      assert.equal(typeof actionPlan.createAction, 'function')
    })
    it('should have function createActions.', function () {
      assert.equal(typeof actionPlan.createActions, 'function')
    })
    it('should have function bindAction.', function () {
      assert.equal(typeof actionPlan.bindAction, 'function')
    })
    it('should have function bindActions.', function () {
      assert.equal(typeof actionPlan.bindActions, 'function')
    })
    it('should have function combineActions.', function () {
      assert.equal(typeof actionPlan.combineActions, 'function')
    })
    it('should have function combineActions.', function () {
      assert.equal(typeof actionPlan.createReducer, 'function')
    })
  })
})
