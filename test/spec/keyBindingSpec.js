// use http://jonathan.tang.name/files/js_keycode/test_keycode.html
// to discover key codes

// NOTE: keypress events will only test correctly on single keypresses (or in combination with a shift key)
describe("binding functions to key combinations", function() {

  beforeEach(function() {

    this.callbackFn = sinon.spy();

    this.fixture = $('<div id="container"></div>');
    $('body').append(this.fixture);

    this.createInputEl = function(type, id) {
      var $el = $('<input type="' + type + '" id="' + id + '"/>');
      this.fixture.append($el);
      return $el;
    };

    this.text_input_types = ["text", "password", "number", "email", "url", "range", "date", "month", "week",
      "time", "datetime", "datetime-local", "search", "color", "tel"];

    // creates new key event
    this.createKeyEvent = function(keyCode, keyEventType) {

      keyEventType = keyEventType || 'keyup';

      var event = jQuery.Event(keyEventType);
      event.keyCode = keyCode;
      event.which = keyCode;

      return event;
    };

    this.assertHotKeyBinding = function(keyEvent, keyCombinationAsText, keyCombinationAsKeyCode, modifiers, $el) {

      if (!keyEvent || !keyCombinationAsText || !keyCombinationAsKeyCode) {
        throw new Error("Missing arguments for assertion, check your arguments.");
      }

      modifiers = modifiers || [];
      $el = $el || $(document);

      var spy = sinon.spy();

      $el.bind(keyEvent, keyCombinationAsText, spy);

      var event = this.createKeyEvent(keyCombinationAsKeyCode, keyEvent);

      $.each(modifiers, function(index, modifier) {
        event[modifier + 'Key'] = true;
      });

      $el.trigger(event);
      sinon.assert.calledOnce(spy);
    }
  });

  afterEach(function() {
    this.fixture.remove();
    $(document).unbind();
  });

  it("should bind the 'return' key to the document and trigger the bound callback", function() {
    this.assertHotKeyBinding('keyup', 'return', 13);
  });

  it("should bind the 'alt+s' keys and call the callback handler function", function() {
    this.assertHotKeyBinding('keyup', 'alt+a', 65, ['alt']);
  });
  it("should bind the 'ctrl+s' keys and call the callback handler function", function() {
    this.assertHotKeyBinding('keyup', 'ctrl+a', 65, ['ctrl']);
  });

  it("should bind the 'alt+f2' keys for keyup and call the callback handler function", function() {
    this.assertHotKeyBinding('keyup', 'alt+f2', 113, ['alt']);
  });

  it("should bind the 'shift+pagedown' keys and call the callback handler function", function() {
    this.assertHotKeyBinding('keyup', 'shift+pagedown', 34, ['shift']);
  });

  it("should bind the 'alt+shift+a' with a namespace, trigger the callback handler and unbind correctly", function() {

    var spy = sinon.spy();

    $(document).bind('keyup.a', 'alt+shift+a', spy);
    $(document).bind('keyup.b', 'alt+shift+a', spy);
    $(document).unbind('keyup.a'); // remove first binding, leaving only second

    var event = this.createKeyEvent(65, 'keyup');
    event.altKey = true;
    event.shiftKey = true;
    $(document).trigger(event);

    // ensure only second binding is still in effect
    sinon.assert.calledOnce(spy);
  });

  it("should bind the 'meta+a' keys and call the callback handler function", function() {
    this.assertHotKeyBinding('keyup', 'meta+a', 65, ['meta']);
  });

  it("should bind the 'hyper+a' keys and call the callback handler function", function() {
    this.assertHotKeyBinding('keyup', 'hyper+a', 65, ['alt', 'ctrl', 'meta', 'shift']);
  });

  it("should not trigger event handler callbacks bound to any standard input types if not bound directly", function() {

    var i = 0;

    _.each(this.text_input_types, function(input_type) {

      var spy = sinon.spy();

      var $el = this.createInputEl(input_type, ++i);
      $(document).bind('keyup', 'a', spy);

      var event = this.createKeyEvent('65', 'keyup');
      $el.trigger(event);

      sinon.assert.notCalled(spy);
      $(document).unbind();
      $el.remove();

    }, this);
  });

  it("should bind and trigger events from an input element if bound directly", function() {

    var i = 0;

    _.each(this.text_input_types, function(input_type) {

      var $el = this.createInputEl(input_type, ++i);
      this.assertHotKeyBinding('keyup', 'a', 65, [], $el);
      $el.remove(); // unbound when removed

    }, this);
  });

  it("should support F13-19", function() {
    var $doc = $(document);
    var sequence = '';

    function makeSequencer(index) {
      return function() {
        sequence += '.' + index;
      };
    }

    // Add listeners for each F key
    for (var i = 1; i <= 19; i++) {
      $doc.bind('keydown', 'f' + i, makeSequencer(i));
    }

    // Trigger a keypress on each F key
    for (var j = 1; j <= 19; j++) {
      var event = this.createKeyEvent(111 + j, 'keydown');
      $doc.trigger(event);
    }

    expect(sequence).toEqual('.1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19');
  });
});
