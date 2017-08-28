'use strict'

var assert = require('assert')
var plan = require('./index')

describe('module', function () {
  describe('exports', function () {
    it('should be a function to create a reducer for a named action.', function () {
      assert.equal(typeof plan, 'function')
    })
    it('should have function createAction.', function () {
      assert.equal(typeof plan.createAction, 'function')
    })
    it('should have function createActions.', function () {
      assert.equal(typeof plan.createActions, 'function')
    })
    it('should have function bindAction.', function () {
      assert.equal(typeof plan.bindAction, 'function')
    })
    it('should have function nopReducer.', function () {
      assert.equal(typeof plan.nopReducer, 'function')
    })
    it('should have function bindActions.', function () {
      assert.equal(typeof plan.bindActions, 'function')
    })
    it('should have function combineActions.', function () {
      assert.equal(typeof plan.combineActions, 'function')
    })
    it('should have function combineActions.', function () {
      assert.equal(typeof plan.createReducer, 'function')
    })
  })
})

describe('Static Functions', function () {
  describe('createAction', function () {
    it('should create a default action creator w/o payload', function () {
      var type = 'type-value'
      var p1 = 'payload1'
      var p2 = 'payload2'

      var create = plan.createAction(type)
      assert.equal(typeof create, 'function', 'create is not a function.')

      var action = create(p1, p2)
      assert.equal(typeof action, 'object', 'action is not a object')
      assert.equal(action.type, type, 'wrong type value')
      assert.equal(action.payload, p1, 'wrong payload value')
    })
    it('should create an action creator w/ a payload field name', function () {
      var type = 'type-value'
      var p1 = 'payload1'
      var p2 = 'payload2'

      var create = plan.createAction(type, 'p1')
      assert.equal(typeof create, 'function', 'create is not a function.')

      var action = create(p1, p2)
      assert.equal(typeof action, 'object', 'action is not a object')
      assert.equal(action.type, type, 'wrong type value')
      assert.equal(action.p1, p1, 'wrong payload value')
      assert.equal(typeof action.payload, 'undefined', 'invalid payload field')
    })
    it('should create an action creator w/ with multiple payload fields', function () {
      var type = 'type-value'
      var p1 = 'payload1'
      var p2 = 'payload2'

      var create = plan.createAction(type, ['p1', 'p2'])
      assert.equal(typeof create, 'function', 'create is not a function.')

      var action = create(p1, p2)
      assert.equal(typeof action, 'object', 'action is not a object')
      assert.equal(action.type, type, 'wrong type value')
      assert.equal(action.p1, p1, 'wrong paload value')
      assert.equal(action.p2, p2, 'wrong paload value')
      assert.equal(typeof action.payload, 'undefined', 'invalid payload field')
    })
  })
  describe('createActions', function () {
    it('should create a group of default action creator w/o payloads', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var p1 = 'payload1'
      var p2 = 'payload2'

      var actions = plan.createActions({
        action1: type1,
        action2: type2
      })
      assert.equal(typeof actions.action1, 'function', 'creator 1 is not a function.')
      assert.equal(typeof actions.action2, 'function', 'creator 2 is not a function.')

      var action1 = actions.action1(p1, p2)
      assert.equal(typeof action1, 'object', 'action1 is not a object')
      assert.equal(action1.type, type1, 'action1: wrong type value')
      assert.equal(action1.payload, p1, 'action1: wrong payload value')

      var action2 = actions.action2(p1, p2)
      assert.equal(typeof action2, 'object', 'action2 is not a object')
      assert.equal(action2.type, type2, 'action2: wrong type value')
      assert.equal(action2.payload, p1, 'action2: wrong payload value')
    })
  })
  describe('nopReducer', function () {
    it('should create an empty reducer using null as the default inital state.', function () {
      var state = 'state-value'
      var nop = plan.nopReducer()
      assert.equal(typeof nop, 'function', 'nop is not a function')
      assert.equal(nop(), null, 'initial state is invalid')
      assert.equal(nop(state), state, 'state is invalid')
    })
    it('should create an empty reducer using initialState to supplement a missing state.', function () {
      var state = 'state-value'
      var initState = 'init-state'
      var nop = plan.nopReducer(initState)
      assert.equal(typeof nop, 'function', 'nop is not a function')
      assert.equal(nop(), initState, 'initial state is invalid')
      assert.equal(nop(state), state, 'state is invalid')
    })
  })
  describe('bindAction', function () {
    it('should create an empty reducer function w/o handler and initialState.', function () {
      var type = 'type-value'
      var reducer = plan.bindAction(type)
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var state = 'state-value'
      var newState = reducer(state)
      assert.equal(newState, state, 'new state is invalid')
    })
    it('should create a reducer function w/ a handler.', function () {
      var type = 'type-value'
      var state = 'state-value'
      var newStateValue = 'new-state'
      var reducer = plan.bindAction(type, function (s, a) {
        assert.equal(a.type, type, 'invalid action type.')
        assert.equal(s, state, 'invalid state value.')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, { type: type })
      assert.equal(newState, newStateValue, 'new state is invalid')

      newState = reducer(state, { type: 'invalid-type' })
      assert.equal(newState, state, 'original state is expected.')
    })
    it('should create a reducer function w/ a handler and provide initialState if action matched.', function () {
      var type = 'type-value'
      var newStateValue = 'new-state'
      var initStateValue = 'init-state'
      var reducer = plan.bindAction(type, function (s, a) {
        assert.equal(a.type, type, 'invalid action type.')
        assert.equal(s, initStateValue, 'invalid state value.')
        return newStateValue
      }, initStateValue)
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(undefined, { type: type })
      assert.equal(newState, newStateValue, 'new state is invalid')

      newState = reducer(initStateValue, { type: 'invalid-type' })
      assert.equal(newState, initStateValue, 'initial state is expected.')
    })
  })
  describe('combineActions', function () {
    it('should create a reducer function for actions w/o initialState.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var state = 'state-value'
      var state1 = 'state-value1'
      var state2 = 'state-value2'
      var reducer = plan.combineActions({
        'type-value1': function (s, a) {
          assert.equal(a.type, type1, 'action1: invalid type')
          assert.equal(s, state, 'action1: invalid state')
          return state1
        },
        'type-value2': function (s, a) {
          assert.equal(a.type, type2, 'action2: invalid type')
          assert.equal(s, state, 'action2: invalid state')
          return state2
        }
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState1 = reducer(state, {type: type1})
      assert.equal(newState1, state1, 'new state1 is invalid')

      var newState2 = reducer(state, {type: type2})
      assert.equal(newState2, state2, 'new state2 is invalid')

      var newState = reducer(state, { type: 'invalid-type' })
      assert.equal(newState, state, 'initial state is expected.')
    })
    it('should create a reducer function for actions and provide initialState.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var initState = 'init-state-value'
      var state1 = 'state-value1'
      var state2 = 'state-value2'
      var reducer = plan.combineActions({
        'type-value1': function (s, a) {
          assert.equal(a.type, type1, 'action1: invalid type')
          assert.equal(s, initState, 'action1: invalid state')
          return state1
        },
        'type-value2': function (s, a) {
          assert.equal(a.type, type2, 'action2: invalid type')
          assert.equal(s, initState, 'action2: invalid state')
          return state2
        }
      }, initState)
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState1 = reducer(undefined, {type: type1})
      assert.equal(newState1, state1, 'new state1 is invalid')

      var newState2 = reducer(undefined, {type: type2})
      assert.equal(newState2, state2, 'new state2 is invalid')

      var newState = reducer(initState, { type: 'invalid-type' })
      assert.equal(newState, initState, 'initial state is expected.')
    })
  })
  describe('bindActions', function () {
    it('should create an empty reducer function w/o handler and initialState.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var reducer = plan.bindActions([type1, type2])
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var state = 'state-value'
      var newState = reducer(state, {type: type1})
      assert.equal(newState, state, 'action1: new state is invalid')

      newState = reducer(state, {type: type2})
      assert.equal(newState, state, 'action2: new state is invalid')

      newState = reducer(state, {type: 'invalid-type'})
      assert.equal(newState, state, 'action3: new state is invalid')
    })
    it('should create a reducer function w/ the handler for actions.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var state = 'state-value'
      var newStateValue = 'new-state-value'
      var reducer = plan.bindActions([type1, type2], function (s, a) {
        assert.equal(s, state, 'invalid state')
        assert(a.type === type1 || a.type === type2, 'invalid action type')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, {type: type1})
      assert.equal(newState, newStateValue, 'action1: new state is invalid')

      newState = reducer(state, {type: type2})
      assert.equal(newState, newStateValue, 'action2: new state is invalid')

      newState = reducer(state, {type: 'invalid-type'})
      assert.equal(newState, state, 'action3: new state is invalid')
    })
    it('should create a reducer function w/ the handler and provide initialState.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var initState = 'init-state-value'
      var newStateValue = 'new-state-value'
      var reducer = plan.bindActions([type1, type2], function (s, a) {
        assert.equal(s, initState, 'invalid state')
        assert(a.type === type1 || a.type === type2, 'invalid action type')
        return newStateValue
      }, initState)
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(undefined, {type: type1})
      assert.equal(newState, newStateValue, 'action1: new state is invalid')

      newState = reducer(undefined, {type: type2})
      assert.equal(newState, newStateValue, 'action2: new state is invalid')

      newState = reducer(undefined, {type: 'invalid-type'})
      assert.equal(newState, initState, 'action3: new state is invalid')
    })
  })
  describe('createReducer', function () {
    it('should work like bindAction if the first argument is string.', function () {
      var type = 'type-value'
      var state = 'state-value'
      var newStateValue = 'new-state-value'
      var reducer = plan.createReducer(type, function (s, a) {
        assert.equal(s, state, 'invalid state value')
        assert.equal(a.type, type, 'invalid action type')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, {type: type})
      assert.equal(newState, newStateValue, 'new state is invalid')

      newState = reducer(state, {type: 'invalid-type'})
      assert.equal(newState, state, 'original state is expected')
    })
    it('should work like bindActions if the first argument is an array.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var state = 'state-value'
      var newStateValue = 'new-state-value'
      var reducer = plan.createReducer([type1, type2], function (s, a) {
        assert.equal(s, state, 'invalid state')
        assert(a.type === type1 || a.type === type2, 'invalid action type')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, {type: type1})
      assert.equal(newState, newStateValue, 'action1: new state is invalid')

      newState = reducer(state, {type: type2})
      assert.equal(newState, newStateValue, 'action2: new state is invalid')

      newState = reducer(state, {type: 'invalid-type'})
      assert.equal(newState, state, 'action3: new state is invalid')
    })
    it('should work like combineActions if the first argument is an object.', function () {
      var type1 = 'type-value1'
      var type2 = 'type-value2'
      var initState = 'init-state-value'
      var state1 = 'state-value1'
      var state2 = 'state-value2'
      var reducer = plan.createReducer({
        'type-value1': function (s, a) {
          assert.equal(a.type, type1, 'action1: invalid type')
          assert.equal(s, initState, 'action1: invalid state')
          return state1
        },
        'type-value2': function (s, a) {
          assert.equal(a.type, type2, 'action2: invalid type')
          assert.equal(s, initState, 'action2: invalid state')
          return state2
        }
      }, initState)
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState1 = reducer(undefined, {type: type1})
      assert.equal(newState1, state1, 'new state1 is invalid')

      var newState2 = reducer(undefined, {type: type2})
      assert.equal(newState2, state2, 'new state2 is invalid')

      var newState = reducer(initState, { type: 'invalid-type' })
      assert.equal(newState, initState, 'initial state is expected.')
    })
  })
})

describe('Action Plan', function () {
  var type1 = 'type-value1'
  var type2 = 'type-value2'
  var state = 'state-value'
  var newStateValue = 'new-state-value'
  var typeMap = {
    action1: type1,
    action2: type2
  }
  var actions = plan(typeMap)
  describe('default exports: createPlanner', function () {
    it('should create a factory function to produce a group of action creators.', function () {
      assert.equal(typeof actions, 'function', 'actions is not a function.')
      assert.equal(typeof actions.bind, 'function', 'actions.bind is not a function')
      assert.equal(typeof actions.combine, 'function', 'actions.combine is not a function')
      assert.equal(typeof actions.reducer, 'function', 'actions.reducer is not a function')
      assert.equal(typeof actions.nop, 'function', 'actions.nop is not a function')

      var Actions = actions()
      assert.equal(typeof Actions, 'object', 'Actions is not an object.')

      var p1 = 'payload1'
      var p2 = 'payload2'
      var action1 = Actions.action1(p1, p2)
      assert.equal(action1.type, type1, 'action1 type is invalid')
      assert.equal(action1.payload, p1, 'action1 payload is invalid')

      var action2 = Actions.action2(p2, p1)
      assert.equal(action2.type, type2, 'action2 type is invalid')
      assert.equal(action2.payload, p2, 'action2 payload is invalid')
    })
  })
  describe('actions.bind', function () {
    it('should create a reducer function for an action name and a handler.', function () {
      var reducer = actions.bind('action1', function (s, a) {
        assert.equal(a.type, type1, 'invalid action type.')
        assert.equal(s, state, 'invalid state value.')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, { type: type1 })
      assert.equal(newState, newStateValue, 'new state is invalid')

      newState = reducer(state, { type: type2 })
      assert.equal(newState, state, 'original state is expected.')
    })
    it('should create a reducer function for an array of action names and a handler.', function () {
      var reducer = actions.bind(['action1', 'action2'], function (s, a) {
        assert.equal(s, state, 'invalid state')
        assert(a.type === type1 || a.type === type2, 'invalid action type')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, {type: type1})
      assert.equal(newState, newStateValue, 'action1: new state is invalid')

      newState = reducer(state, {type: type2})
      assert.equal(newState, newStateValue, 'action2: new state is invalid')

      newState = reducer(state, {type: 'invalid-type'})
      assert.equal(newState, state, 'action3: new state is invalid')
    })
  })
  describe('actions.combine', function () {
    it('should create a reducer function for actions w/o initialState.', function () {
      var state1 = 'state-value1'
      var state2 = 'state-value2'
      var reducer = actions.combine({
        action1: function (s, a) {
          assert.equal(a.type, type1, 'action1: invalid type')
          assert.equal(s, state, 'action1: invalid state')
          return state1
        },
        action2: function (s, a) {
          assert.equal(a.type, type2, 'action2: invalid type')
          assert.equal(s, state, 'action2: invalid state')
          return state2
        }
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState1 = reducer(state, {type: type1})
      assert.equal(newState1, state1, 'new state1 is invalid')

      var newState2 = reducer(state, {type: type2})
      assert.equal(newState2, state2, 'new state2 is invalid')

      var newState = reducer(state, { type: 'invalid-type' })
      assert.equal(newState, state, 'initial state is expected.')
    })
  })
  describe('actions.reducer', function () {
    it('should work like actions.bind if the first argument is string.', function () {
      var reducer = actions.reducer('action1', function (s, a) {
        assert.equal(s, state, 'invalid state value')
        assert.equal(a.type, type1, 'invalid action type')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, {type: type1})
      assert.equal(newState, newStateValue, 'new state is invalid')

      newState = reducer(state, {type: type2})
      assert.equal(newState, state, 'original state is expected')
    })
    it('should work like actions.bind if the first argument is an array.', function () {
      var reducer = actions.reducer(['action1', 'action2'], function (s, a) {
        assert.equal(s, state, 'invalid state')
        assert(a.type === type1 || a.type === type2, 'invalid action type')
        return newStateValue
      })
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState = reducer(state, {type: type1})
      assert.equal(newState, newStateValue, 'action1: new state is invalid')

      newState = reducer(state, {type: type2})
      assert.equal(newState, newStateValue, 'action2: new state is invalid')

      newState = reducer(state, {type: 'invalid-type'})
      assert.equal(newState, state, 'action3: new state is invalid')
    })
    it('should work like actions.combine if the first argument is an object.', function () {
      var initState = 'init-state-value'
      var state1 = 'state-value1'
      var state2 = 'state-value2'
      var reducer = actions.reducer({
        action1: function (s, a) {
          assert.equal(a.type, type1, 'action1: invalid type')
          assert.equal(s, initState, 'action1: invalid state')
          return state1
        },
        action2: function (s, a) {
          assert.equal(a.type, type2, 'action2: invalid type')
          assert.equal(s, initState, 'action2: invalid state')
          return state2
        }
      }, initState)
      assert.equal(typeof reducer, 'function', 'reducer is not a function.')

      var newState1 = reducer(undefined, {type: type1})
      assert.equal(newState1, state1, 'new state1 is invalid')

      var newState2 = reducer(undefined, {type: type2})
      assert.equal(newState2, state2, 'new state2 is invalid')

      var newState = reducer(undefined, { type: 'invalid-type' })
      assert.equal(newState, initState, 'initial state is expected.')
    })
  })
  describe('actions.nop', function () {
    it('should create an empty reducer using null as the default inital state.', function () {
      var state = 'state-value'
      var nop = actions.nop()
      assert.equal(typeof nop, 'function', 'nop is not a function')
      assert.equal(nop(), null, 'initial state is invalid')
      assert.equal(nop(state), state, 'state is invalid')
    })
    it('should create an empty reducer using initialState to supplement a missing state.', function () {
      var state = 'state-value'
      var initState = 'init-state'
      var nop = actions.nop(initState)
      assert.equal(typeof nop, 'function', 'nop is not a function')
      assert.equal(nop(), initState, 'initial state is invalid')
      assert.equal(nop(state), state, 'state is invalid')
    })
  })
})
