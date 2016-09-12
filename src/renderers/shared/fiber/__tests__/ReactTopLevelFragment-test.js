/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
 */

'use strict';

var React;
var ReactNoop;

// This is a new feature in Fiber so it
describe('ReactTopLevelFragment', function() {
  beforeEach(function() {
    React = require('React');
    ReactNoop = require('ReactNoop');
  });

  it('should render a simple fragment at the top of a component', function() {

    function Fragment() {
      return [<div key="a">Hello</div>, <div key="b">World</div>];
    }
    ReactNoop.render(<Fragment />);
    ReactNoop.flush();

  });

  it('should preserve state when switching from a single child', function() {

    var instance = null;

    class Stateful extends React.Component {
      render() {
        instance = this;
        return <div>Hello</div>;
      }
    }

    function Fragment({ condition }) {
      return condition ? <Stateful key="a" /> :
        [<Stateful key="a" />, <div key="b">World</div>];
    }
    ReactNoop.render(<Fragment />);
    ReactNoop.flush();

    var instanceA = instance;

    expect(instanceA).not.toBe(null);

    ReactNoop.render(<Fragment condition />);
    ReactNoop.flush();

    var instanceB = instance;

    expect(instanceB).toBe(instanceA);

  });

  it('should not preserve state when switching to a nested array', function() {

    var instance = null;

    class Stateful extends React.Component {
      render() {
        instance = this;
        return <div>Hello</div>;
      }
    }

    function Fragment({ condition }) {
      return condition ? <Stateful key="a" /> :
        [[<Stateful key="a" />, <div key="b">World</div>], <div />];
    }
    ReactNoop.render(<Fragment />);
    ReactNoop.flush();

    var instanceA = instance;

    expect(instanceA).not.toBe(null);

    ReactNoop.render(<Fragment condition />);
    ReactNoop.flush();

    var instanceB = instance;

    expect(instanceB).not.toBe(instanceA);

  });

});
