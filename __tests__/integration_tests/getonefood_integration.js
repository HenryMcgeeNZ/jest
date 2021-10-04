
// supertest allows us to send HTTP requests to our app
// install it: npm install supertest --save-dev
const request = require('supertest');

// since this file is inside __test__/integration folder, we will
// need to go back two levels ('../../') to get to the root folder
// and then we import our app (from app.js)
// IMPORTANT: make sure your export your app in app.js .e.g.
// module.exports = app
const app = require('../../app'); // the express server
/*const { collection } = require('../../models/food');*/

// now we are going to test the route to get one food item, and this
// test with also test the controller and models.

/*
    Test Suite for testing get one food functionality:         
*/

describe('Integration test: get one food (Apple)', () => {
    // we need to use request.agent so that we can create and
    // use sessions
    let agent = request.agent(app);

    // store cookie returned by our app. 
    // If the API server returns a token instead, we will 
    // store the token
    let cookie = null;


    // These types of functions are called to 'setup' or
    // 'tear down' functions. In this example, we are
    // using the beforeAll function to create a request
    // agent that is authenticated and can be used by all
    // tests within  this suite. 
    beforeAll(() => agent
        // send a POST request to login
        .post('/user/login') 
        // IMPORTANT: without the content type setting your request
        // will be ignored by express
        .set('Content-Type', 'application/x-www-form-urlencoded')
        // send the username and password
        .send({
          email: 'test',
          password: 'test',
        })
        // when we get back the cookie, store it in a variable.
        // If the API server returns a token store it here instead
        // of the cookie
        .then((res) => {
            cookie = res
               .headers['set-cookie'][0]
               .split(',')
               .map(item => item.split(';')[0])
               .join(';')
         }));
  
    // Test Case 1: Food ID = 60741060d14008bd0efff9d5 (Food = Apple)
    // look up food with object ID 60741060d14008bd0efff9d5
    test('Test 1 (lookup valid food): Apple (60741060d14008bd0efff9d5)', () => {
      // using supertest to send a GET request on the route '/'
      // we know that the foodRouter will handle all routes sent to '/' (see app.js)  
      return agent
        // send a request to app on the route /food/:id
        // with id = 60741060d14008bd0efff9d5
        .get('/foods/60741060d14008bd0efff9d5')
        // we set the cookie in the header
        // If this was an API server that used a 
        // token we would add the following:
        //.set('Authorization', `Bearer ${token}`)
        .set('Cookie', cookie)
        .then((response) => {
          // HTTP response code should be OK/200  
          expect(response.statusCode).toBe(200);
          // FoodBuddy App will return a page, so expect html  
          //expect(response.type).toBe('text/html');
          // some where on the page, we should find a hidden paragraph
          // with the Food id becuase I designed the page to contain
          // the hidden paragraph.  
          expect(response.text).toContain('<p id="foodid" hidden>60741060d14008bd0efff9d5</p>');
        });
    });

    // Test Case 2: Food ID = 1234 (Food = DOES NOT EXIST)
    // look up food with INVALID object ID
    test('Test 2 (lookup INVALID food): ??? (1234)', () => {
        return agent
          // send a request to app on the route /food/:id
          // with id = 1234
          .get('/foods/1234')
          .set('Cookie', cookie)
          .then((response) => {
            // HTTP response code should be OK/200 
            expect(response.statusCode).toBe(200);
            // FoodBuddy App will return a page, so expect html  
            //expect(response.type).toBe('text/html');
            // we expect the server to respond with the message:
            // Error: Food not found!  
            expect(response.text).toContain('Error: Food not found!');
          });
      });

      

});


/*
  
    

*/