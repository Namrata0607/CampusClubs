function greetUser(name, callback){
    console.log("Hello, " + name + "!");
    callback();
}
function displayMsg(){
    console.log("Welcome to the callback function!");
}
greetUser("Alice", displayMsg);