/**
 * Assignment-10: Node.js Events Demonstration
 * 
 * This program demonstrates the EventEmitter module in Node.js
 * - Creating custom event emitters
 * - Registering event listeners (on, once)
 * - Emitting events with data
 * - Removing event listeners
 */

const EventEmitter = require('events');

// ============= Example 1: Basic EventEmitter =============
console.log('===== Example 1: Basic EventEmitter =====');

// Create a custom EventEmitter instance
const myEmitter = new EventEmitter();

// Register a listener for 'greet' event
myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}! Welcome to Node.js Events.`);
});

// Emit the 'greet' event
myEmitter.emit('greet', 'Alice');
myEmitter.emit('greet', 'Bob');

// ============= Example 2: Multiple Listeners =============
console.log('\n===== Example 2: Multiple Listeners =====');

const eventBus = new EventEmitter();

// Add multiple listeners for the same event
eventBus.on('user-login', (userId) => {
  console.log(`[Logger] User ${userId} logged in`);
});

eventBus.on('user-login', (userId) => {
  console.log(`[Analytics] Recording login for user ${userId}`);
});

eventBus.on('user-login', (userId) => {
  console.log(`[Notification] Sending welcome message to user ${userId}`);
});

// Emit the event once - all listeners will be triggered
eventBus.emit('user-login', 'user123');

// ============= Example 3: Once (One-time Listener) =============
console.log('\n===== Example 3: Once (One-time Listener) =====');

const server = new EventEmitter();

// This listener will only be called once
server.once('start', () => {
  console.log('Server is starting for the first time');
});

// Emit 'start' multiple times
server.emit('start');
server.emit('start'); // This won't trigger the listener
console.log('Emitted start event twice, but once() listener fires only once');

// ============= Example 4: Removing Event Listeners =============
console.log('\n===== Example 4: Removing Event Listeners =====');

const removalDemo = new EventEmitter();

// Define a named function so we can remove it later
const onMessage = (msg) => {
  console.log(`Message received: ${msg}`);
};

// Register the listener
removalDemo.on('message', onMessage);

// Emit event - listener will be called
removalDemo.emit('message', 'Hello');

// Remove the listener
removalDemo.removeListener('message', onMessage);

// Emit event again - listener will NOT be called
removalDemo.emit('message', 'World');
console.log('After removing listener, second emit did not trigger');

// ============= Example 5: EventEmitter Error Handling =============
console.log('\n===== Example 5: Error Handling =====');

const process2 = new EventEmitter();

// Register an 'error' event listener (good practice!)
process2.on('error', (err) => {
  console.log(`[Error Handler] Caught error: ${err.message}`);
});

process2.on('complete', () => {
  console.log('Process completed successfully');
});

// Emit a normal event
process2.emit('complete');

// Emit an error event
process2.emit('error', new Error('Something went wrong!'));

// ============= Example 6: Custom Class with EventEmitter =============
console.log('\n===== Example 6: Custom Class Extending EventEmitter =====');

class DataProcessor extends EventEmitter {
  constructor() {
    super();
  }

  process(data) {
    console.log(`Processing: ${data}`);
    this.emit('processing', { data, timestamp: new Date() });
  }

  complete(result) {
    this.emit('completed', { result, timestamp: new Date() });
  }
}

const processor = new DataProcessor();

// Listen to custom events
processor.on('processing', (info) => {
  console.log(`  [Processing Started] Data: ${info.data}`);
});

processor.on('completed', (info) => {
  console.log(`  [Processing Completed] Result: ${info.result}`);
});

// Use the processor
processor.process('Sample Data');
processor.complete('Success');

// ============= Example 7: Listener Info =============
console.log('\n===== Example 7: Listener Information =====');

const infoEmitter = new EventEmitter();

// Add some listeners
infoEmitter.on('test', () => {});
infoEmitter.on('test', () => {});
infoEmitter.once('test', () => {});

// Get listener count and names
const listenerCount = infoEmitter.listenerCount('test');
const eventNames = infoEmitter.eventNames();

console.log(`Event 'test' has ${listenerCount} listeners`);
console.log(`All events: ${eventNames.join(', ')}`);

// ============= Summary =============
console.log('\n===== Summary =====');
console.log('Key concepts demonstrated:');
console.log('1. Basic event emission and listening (on)');
console.log('2. Multiple listeners for one event');
console.log('3. One-time listeners (once)');
console.log('4. Removing listeners (removeListener)');
console.log('5. Error event handling');
console.log('6. Custom classes extending EventEmitter');
console.log('7. Inspecting listeners (listenerCount, eventNames)');