// async function test() { 
//   const promise = new Promise((resolve) => {
//     setTimeout(() => {
//       resolve("resolved");
//     }, 1000);





  
//   });
//   const result = await promise;
//   console.log(result);
// }
// test();


// const task1 = () => {console.log("Task 1212");}
// const task2 = () => {console.log("Task 2");}
// const task3 = () => {console.log("Task 3");} 

// const tasks = [task1,task2, task3];

// async function runTasks() {
//   for (const task of tasks) {
    

    
//   }
// }

// runTasks();

// setTimeout(() => {
//   console.log("Task 1");
// }     

// , 1000);



const task1 = () => new Promise ((resolve) => {
    setTimeout(() => {
      console.log("Task 1");
      resolve();  
    },1000)
})
const task2 = () => new Promise ((resolve) => {
    setTimeout(() => {
      console.log("Task 2");
      resolve();  
    },1000)   
})
const task3 = () => new Promise ((resolve) => {
    setTimeout(() => {
      console.log("Task 3");
      resolve();  
    },1000)   
})
const tasks = [task1, task2, task3];

async function runTasks() {
  for (let i =0; i < tasks.length; i++) {
    await tasks[i]();
  }   

}

runTasks()