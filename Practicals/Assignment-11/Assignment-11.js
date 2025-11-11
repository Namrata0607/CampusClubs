/**
 * Assignment-11: Node.js File System (fs) Demonstration
 * 
 * This program demonstrates the File System module in Node.js
 * - Reading files (sync and async)
 * - Writing files
 * - Creating and deleting directories
 * - Listing directory contents
 * - File statistics
 * - Appending to files
 * 
 * Uses a single test file (testfile.txt) for all operations
 */

const fs = require('fs');
const path = require('path');

// Single test file for all operations
const testFile = path.join(__dirname, 'testfile.txt');

// ============= Example 1: Writing and Reading Files (Synchronous) =============
console.log('===== Example 1: Writing and Reading Files (Sync) =====');

// Write to a file (synchronous)
fs.writeFileSync(testFile, 'Hello, Node.js File System!\n');
console.log('✓ File written:', testFile);

// Read from a file (synchronous)
const content = fs.readFileSync(testFile, 'utf-8');
console.log('✓ File content:', content);

// ============= Example 2: Writing and Reading Files (Asynchronous) =============
console.log('\n===== Example 2: Writing and Reading Files (Async) =====');

// Write asynchronously
fs.writeFile(testFile, 'Async file operations in Node.js\n', (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('✓ Async file written');

    // Read asynchronously
    fs.readFile(testFile, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
      } else {
        console.log('✓ Async file content:', data);
      }
    });
  }
});

// ============= Example 3: File Statistics =============
console.log('\n===== Example 3: File Statistics =====');

fs.stat(testFile, (err, stats) => {
  if (err) {
    console.error('Error getting file stats:', err);
  } else {
    console.log('File Statistics:');
    console.log('  Size:', stats.size, 'bytes');
    console.log('  Created:', stats.birthtime);
    console.log('  Modified:', stats.mtime);
    console.log('  Is File:', stats.isFile());
    console.log('  Is Directory:', stats.isDirectory());
  }
});

// ============= Example 4: Appending to Files =============
console.log('\n===== Example 4: Appending to Files =====');

fs.writeFileSync(testFile, 'Line 1: Initial content\n');
console.log('✓ File reset');

fs.appendFileSync(testFile, 'Line 2: Appended content\n');
fs.appendFileSync(testFile, 'Line 3: More appended content\n');
console.log('✓ Content appended');

const appendedContent = fs.readFileSync(testFile, 'utf-8');
console.log('✓ Final content:\n' + appendedContent);

// ============= Example 5: Creating and Managing Directories =============
console.log('\n===== Example 5: Creating and Managing Directories =====');

const dirPath = path.join(__dirname, 'test-dir');

// Create a directory
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  console.log('✓ Directory created:', dirPath);
} else {
  console.log('✓ Directory already exists:', dirPath);
}

// Create a nested directory
const nestedDirPath = path.join(dirPath, 'nested', 'deep');
if (!fs.existsSync(nestedDirPath)) {
  fs.mkdirSync(nestedDirPath, { recursive: true });
  console.log('✓ Nested directory created:', nestedDirPath);
}

// ============= Example 6: Listing Directory Contents =====
console.log('\n===== Example 6: Listing Directory Contents =====');

console.log('Current folder contents:');
fs.readdirSync(__dirname).forEach((file) => {
  console.log('  -', file);
});

// ============= Example 7: Renaming Files =============
console.log('\n===== Example 7: Renaming Files =====');

const tempFile = path.join(__dirname, 'temp-file.txt');
const renamedFile = path.join(__dirname, 'renamed-file.txt');

fs.writeFileSync(tempFile, 'This file will be renamed');
console.log('✓ Original file created');

fs.renameSync(tempFile, renamedFile);
console.log('✓ File renamed:', renamedFile);

// ============= Example 8: Copying Files =============
console.log('\n===== Example 8: Copying Files =====');

const copiedFile = path.join(__dirname, 'copied-file.txt');
fs.copyFileSync(renamedFile, copiedFile);
console.log('✓ File copied');

// ============= Example 9: Promises-based File Operations (Modern Async/Await) =============
console.log('\n===== Example 9: Async/Await with Promises =====');

async function demoPromises() {
  try {
    // Write file using promises
    await fs.promises.writeFile(testFile, 'Modern async/await file operations\n');
    console.log('✓ File written using promises');

    // Read file using promises
    const data = await fs.promises.readFile(testFile, 'utf-8');
    console.log('✓ File read using promises:', data.trim());

    // Append file using promises
    await fs.promises.appendFile(testFile, 'Appended with promises\n');
    console.log('✓ Content appended using promises');

    // Get file stats using promises
    const stats = await fs.promises.stat(testFile);
    console.log('✓ File size:', stats.size, 'bytes');
  } catch (err) {
    console.error('Error:', err);
  }
}

// Call async function
demoPromises();

// ============= Example 10: File Watcher =============
console.log('\n===== Example 10: File Watcher =====');

console.log('Watching file for changes...');
const watcher = fs.watch(testFile, (eventType, filename) => {
  console.log(`  [${eventType}] File changed`);
});

// Simulate file change after 2 seconds
setTimeout(() => {
  fs.appendFileSync(testFile, 'Watched modification\n');
}, 2000);

// Stop watching after 5 seconds
setTimeout(() => {
  watcher.close();
  console.log('✓ Watcher closed');
}, 5000);

// ============= Cleanup: Delete temporary files after 6 seconds =============
setTimeout(() => {
  console.log('\n===== Cleanup =====');
  
  if (fs.existsSync(renamedFile)) {
    fs.unlinkSync(renamedFile);
    console.log('✓ Renamed file deleted');
  }
  
  if (fs.existsSync(copiedFile)) {
    fs.unlinkSync(copiedFile);
    console.log('✓ Copied file deleted');
  }

  // Keep only testfile.txt for reference
  console.log('✓ Cleanup complete - testfile.txt kept for reference');
}, 6000);

// ============= Summary =============
console.log('\n===== Summary =====');
console.log('Key File System Operations Demonstrated:');
console.log('1. Writing files (sync & async)');
console.log('2. Reading files (sync & async)');
console.log('3. File statistics');
console.log('4. Appending to files');
console.log('5. Creating directories');
console.log('6. Listing directory contents');
console.log('7. Renaming files');
console.log('8. Copying files');
console.log('9. Async/Await with Promises');
console.log('10. Watching files for changes');
console.log('\nNote: This program uses a single testfile.txt for all operations.');
