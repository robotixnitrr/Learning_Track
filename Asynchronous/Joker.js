//Part 1: Create a Function to Simulate an API Call
function fetchJoke(jokeId){

    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * 1500) + 500;
        setTimeout(() => {
            if(Math.random() < 0.2){
                reject(`Error fetching joke ${jokeId}`);
            } else {
                resolve(`Joke ${jokeId}: Why did the chicken cross the road?`);
            }
        }, delay);
    })
}

//Test
fetchJoke(0)
    .then((value) => console.log(value))
    .catch((error) => console.log(error));

//Part 2: Chaining Promises
fetchJoke(1)
    .then((joke1) => {
        console.log(joke1);
        return fetchJoke(2)
    })
    .then((joke2) => {
        console.log(joke2);
    })
    .catch((error) => console.log("Channing Error:", error));

//Part 3: Parallel Execution with Promise.all
const jokePromises = [fetchJoke(3), fetchJoke(4), fetchJoke(5)];
Promise.all(jokePromises)
    .then((jokes) => {
        console.log('All Jokes:', jokes);
    })
    .catch((error) => {
        console.error('Promise.all error:', error);
    })

//part 4: Doing with Async/Await
async function displayJokes(params) {
    try {
        const joke6 = await fetchJoke(6);
        console.log(joke6);
        const joke7 = await fetchJoke(7);
        console.log(joke7);
    } catch(error) {
        console.error('Async/Await error:', error);
    }
}

displayJokes();