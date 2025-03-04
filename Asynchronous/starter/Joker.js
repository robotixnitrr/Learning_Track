//while doing one part comment rest of parts

// Part 1: Simulate an API Call
function fetchData(itemId) {
    return new Promise((resolve, reject) => {
        // Implement a delay and random error rejection ( use math.random )
    });
}

// Test fetchData
fetchData(0)
    .then((value) => console.log(value))
    .catch((error) => console.log(error));

// Part 2: Chaining Promises


// Part 3: Parallel Execution with Promise.all
const itemPromises = [/* Create an array of fetchData calls */];
Promise.all(itemPromises)

// Part 4: Async/Await Execution
async function displayItems() {
    try {
        // Use await to fetch multiple items sequentially
    } catch (error) {
        console.error('Async/Await error:', error);
    }
}

displayItems();