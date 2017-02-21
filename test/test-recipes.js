const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Recipes', function(){

  before(function(){
    return runServer();
  })

  after(function(){
    return closeServer();
  })

  it('should send back JSON representation of all recipes on GET', function(){
    return chai.request(app)
    .get('/recipes')
    .then(function(res){
      res.should.be.json;
      res.should.have.status(200);
    });
  });


  // when new recipe added, ensure has required fields. if not,
  // log error and return 400 status code with hepful message.
  // if okay, add new item, and return it with a status 201.
  it.only('should add new item and return it with a status 201', function(){
    newRecipe = {name: 'cake', ingredients: ['butter', 'flour']}
    return chai.request(app)
    .post('/recipes')
    .send(newRecipe)
    .then(function(res){
      res.should.be.json;
      //res.body.should.include(newRecipe);
      res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
      res.should.have.status(201);
      res.body.should.include.keys('name', 'ingredients', 'id');
      res.body.id.should.not.be.null;
    });
  });


});
