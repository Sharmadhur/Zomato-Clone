const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    };
};
export default TryCatch;
// This code creates a reusable wrapper that executes async
//  Express handlers inside a try/catch block, automatically 
//  catching errors and returning a structured HTTP response 
//  instead of crashing the server.
// An async Express handler is simply a route/middleware function 
// that uses async/await to perform asynchronous work like database 
// calls or API requests.
//async and await are keywords that make asynchronous code look and 
// behave like normal step-by-step code.
//Async: When you put async before a function, This function will run 
// asynchronous work and automatically return a Promise.
//Await: await is used inside an async function, it means Pause this
//  function until the promise finishes..
//this file is NOT defining a route handler, It is defining a:
//✅ handler wrapper (middleware factory)
// Line1:import { Request, Response, RequestHandler, NextFunction } from "express";
// These are TypeScript types — they don’t run at runtime.
// They tell TypeScript:
// a. what a request object looks like
// b. what a response object looks like
// c. what middleware should return
