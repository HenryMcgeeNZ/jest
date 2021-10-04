/*
"describe" is a block that takes two arguments, test suite name and 
a callback with the tests in the suite. 

Each test in the suite is put inside the "test" block, which has the 
test name and a callback that implements the actual test
*/
// connect to Mongoose model
const mongoose = require('mongoose')

// we are going to test the getOneFood from the food controller 
const foodController = require("../../controllers/foodController")

// we will need the Food model. Note that I have also changed the
// way I import the Food and User models in the foodController.js
// because the test would not run without me making that change.
const Food = require("../../models/food");


// defining a test suite for testing the getOneFood
describe("Unit testing getOneFood from foodController.js", () => {

    // mocking the request object. The controller function expects 
    // that at least the request object will have an 'id' params, and
    // isAuthenticated() function.
    // we create a mocking function using jest.fn(), and we can
    // return a mock value for the mock function as well.
    // see: https://jestjs.io/docs/mock-functions
    const req = {
        // searching for Apple in my database
        params: {id:'60741060d14008bd0efff9d5'},
        // assuming that the user is logged in
        isAuthenticated: jest.fn().mockReturnValue('True')
    };

    // response object should have at least a render method
    // so that the controller can render the view
    const res = {
        render: jest.fn()
    };

    // the setup function does a few things before
    // any test is run
    beforeAll(() => {
        // clear the render method (also read about mockReset)
        res.render.mockClear();

        // I'm going to mock the findOne Mongoose method
        // to return some of the details of the object
        // that I'm searching, i.e. Apple. Note that 
        // our DB has more details, but I'm just mocking
        // the details to test the controller
        Food.findOne = jest.fn().mockResolvedValue([{
            _id: '60741060d14008bd0efff9d5',
            name: 'Apple',
            __v: 0
        }]);
        // We are using the lean() method, so need to 
        // mock that as well. I'm mocking the function
        // to return Plain Old JavaScript Object (POJO)
        Food.findOne.mockImplementationOnce(() => ({
            lean: jest.fn().mockReturnValue({
                _id: '60741060d14008bd0efff9d5',
                name: 'Apple'
            }),
        }));
        // And, we call the getOneFood with the mocked
        // request and response objects!
        foodController.getOneFood(req, res);
      });

    // This demo has only one test with a valid food ID 
    test("Test case 1: testing with existing food id \
        60741060d14008bd0efff9d5, expecting details of Apple", () => {
        // when I run the controller, I expect that the render method will
        // be called exactly once        
        expect(res.render).toHaveBeenCalledTimes(1);
        // and because I'm looking up a food that I expect to be in my
        // database, the controller should render the page and not
        // return an error message!
        expect(res.render).toHaveBeenCalledWith('showFood', {"thisfood": {
            _id: "60741060d14008bd0efff9d5", name: 'Apple'}, "loggedin":"True"});
    });
  });


  // defining a test suite for testing the getOneFood
describe("Unit testing getOneFood from foodController.js with invalid food", () => {

    // mocking the request object. The controller function expects 
    // that at least the request object will have an 'id' params, and
    // isAuthenticated() function.
    // we create a mocking function using jest.fn(), and we can
    // return a mock value for the mock function as well.
    // see: https://jestjs.io/docs/mock-functions
    const req = {
        // searching for Apple in my database
        params: {id:'1234'},
        // assuming that the user is logged in
        isAuthenticated: jest.fn().mockReturnValue('True')
    };

    // response object should have at least a render method
    // so that the controller can render the view
    const res = {
        render: jest.fn()
    };

    // the setup function does a few things before
    // any test is run
    beforeAll(() => {
        // clear the render method (also read about mockReset)
        res.render.mockClear();

        // I'm going to mock the findOne Mongoose method
        // to return some of the details of the object
        // that I'm searching, i.e. Apple. Note that 
        // our DB has more details, but I'm just mocking
        // the details to test the controller
        Food.findOne = jest.fn().mockResolvedValue();
        // The database will throw an error when the Object ID
        // is not found, so simulate this with our 
        // database
        Food.findOne.mockImplementationOnce(() => {
            throw new Error();
          });
        // And, we call the getOneFood with the mocked
        // request and response objects!
        foodController.getOneFood(req, res);
      });

    // This demo has only one test with a valid food ID 
    test("Test case 1: testing with invalid food id \
        1234, expecting error message", () => {
        // when I run the controller, I expect that the render method will
        // be called exactly once        
        expect(res.render).toHaveBeenCalledTimes(1);
        // and because I'm looking up a food that is not in my
        // database, the controller should render the error message!
        expect(res.render).toHaveBeenCalledWith('error', {"errorCode": 404, "message":"Error: Food not found!"});
    });
  });