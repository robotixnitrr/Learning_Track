# Step-by-Step Guide to Build the Joke API Simulation

## 1. Setup the Project
- Create a new JavaScript file (e.g., `jokeApi.js`).
- Open the file in a code editor (VS Code, Sublime, etc.).

## 2. Implement an API Call Simulation
- Create a function `fetchData(itemId)`.
- Inside the function:
  - Return a Promise that resolves after a random delay.
  - Use `Math.random()` to randomly reject some requests.

## 3. Test fetchData
- Call `fetchData(0)`.
- Use `.then()` to log the response and `.catch()` to log errors.

## 4. Implement Promise Chaining
- Call `fetchData(1)`, then call `fetchData(2)` inside `.then()`.
- Log responses in order.
- Handle errors using `.catch()`.

## 5. Implement Parallel Execution with Promise.all
- Create an array of multiple `fetchData` calls.
- Use `Promise.all()` to execute them simultaneously.
- Log all responses together.
- Handle errors using `.catch()`.

## 6. Implement Async/Await Execution
- Create an `async` function `displayItems()`.
- Use `await` to fetch multiple items one by one.
- Wrap code in `try...catch` to handle errors.
- Call `displayItems()` to test.

## 7. Run and Debug
- Run the script using `node jokeApi.js`.
- Observe the output and fix any issues.
- Modify logic to experiment with different behaviors.