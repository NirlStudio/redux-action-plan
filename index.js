'use strict'

// make an action creator for an action type.
function createAction (type, payload) {
  return function () {
    var action = { type: type }
    if (typeof payload === 'string') {
      payload = [payload] // one payload property.
    } else if (!payload || !payload.length) {
      payload = ['payload'] // use 'payload' as the name of only property.
    }
    // take payload as a string array.
    for (var i = 0; i < payload.length && i < arguments.length; i++) {
      action[payload[i]] = arguments[i]
    }
    return action
  }
}

// create action creators for a group of types and their payload definition.
function createActions (typeMap, payloads) {
  var names = Object.getOwnPropertyNames(typeMap)
  if (!payloads) {
    payloads = Object.create(null)
  }
  var actions = Object.create(null)
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    actions[name] = createAction(typeMap[name], payloads[name])
  }
  return actions
}

// reducer creator:
//   bind a handler with an action type and an optional initialState
function bindAction (type, handler, initialState) {
  return typeof initialState === 'undefined'
    ? handler ? function (state, action) {
      return action.type === type ? handler(state, action) : state
    } : function (state) {
      return state // an empty state reducer
    }
    : handler ? function (state, action) {
      return action.type === type
        ? handler(typeof state === 'undefined' ? initialState : state, action)
        : state
    } : function (state, action) {
      return action.type === type && typeof state === 'undefined' ? initialState : state
    }
}

// reducer creator:
//   combine multiple actions with their handlers and an optional initial state.
function combineActions (actions, initialState) {
  actions = Object.assign(Object.create(null), actions)
  return typeof initialState === 'undefined'
    ? function (state, action) {
      return actions[action.type] ? actions[action.type](state, action) : state
    }
    : function (state, action) {
      return actions[action.type]
        ? actions[action.type](
            typeof state === 'undefined' ? initialState : state, action
          )
        : state
    }
}

// reducer creator:
//   bind a handler with multiple action types and an optional initialState
function bindActions (types, handler, initialState) {
  if (!handler) { // supplement an empty handler.
    handler = function (state) { return state }
  }
  var actions = {}
  for (var i = 0; i < types.length; i++) {
    actions[types[i]] = handler
  }
  return combineActions(actions, initialState)
}

// The smart reducer creator:
//   create a reducer according to calling arguments.
function createReducer (type, handler, initialState) {
  if (typeof type === 'string') {
    // take type as an action type.
    return bindAction(type, handler, initialState)
  }
  if (type.length) { // a unsafe test for array
    // take type as an action type array.
    return bindActions(type, handler, initialState)
  }
  // take type as a (action-type, handler) map and handler as the initialState
  return combineActions(type, handler)
}

// help to map type names to type values.
var mapTypeNames = Array.prototype.map ? function (names, typeMap) {
  return names.map(function (name) {
    return typeMap[name]
  })
} : function (names, typeMap) {
  var types = []
  for (var i = 0; i < names.length; i++) {
    types.push(typeMap[names[i]])
  }
  return types
}

// create an planner function with an context of action types.
function createPlanner (typeMap) {
  // supplement an empty type map.
  if (!typeMap) {
    typeMap = Object.create(null)
  }

  // the default function is to create action creators.
  var planner = function (payloads) {
    return createActions(typeMap, payloads)
  }

  // create a reducer by a handler with one or more actions by name.
  planner.bind = function (actionName, handler, initialState) {
    if (typeof actionName === 'string') {
      return bindAction(typeMap[actionName], handler, initialState)
    }
    if (actionName.length) { // unsafe array.
      return bindActions(mapTypeNames(actionName, typeMap), handler, initialState)
    }
    return function (state) { return state } // an empty reducer.
  }

  // create a reducer by combine several action handlers.
  planner.combine = function (handlers, initialState) {
    // convert the (action-name, handler) map to a (action-type, handler) map.
    var names = Object.getOwnPropertyNames(handlers)
    var actions = {}
    for (var i = 0; i < names.length; i++) {
      actions[typeMap[names[i]]] = handlers[names[i]]
    }
    return combineActions(actions, initialState)
  }

  // create a reducer according to the type of arguments
  planner.reducer = function (action, handler, initialState) {
    return typeof action === 'string' || action.length
      // take action as an action name or an action name array.
      ? planner.bind(action, handler, initialState)
      // take action as a (action-name, handler) map and handler as initialState.
      : planner.combine(action, handler)
  }

  return planner
}

// publish static functions to the default function.
createPlanner.createAction = createAction
createPlanner.createActions = createActions
createPlanner.bindAction = bindAction
createPlanner.bindActions = bindActions
createPlanner.combineActions = combineActions
createPlanner.createReducer = createReducer

// export default function.
module.exports = createPlanner
