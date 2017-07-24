const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, closeServer, runServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Blog Posts', function(){

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'title', 'content', 'author', 'publishDate', 'id');
        });
      });
  });

  it('should add an item on POST', function() {
	const newPost = {title: 'Welcome to Iphone 3', content: 'Insert Paragraph', author: 'Steve Jobs'};
	return chai.request(app)
	  .post('/blog-posts')
	  .send(newPost)
	  .then(function(res) {
	    res.should.have.status(201);
	    res.should.be.json;
	    res.body.should.be.a('object');
	    res.body.should.include.keys('id', 'title', 'content', 'author');
	    res.body.id.should.not.be.null;
	    //res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
    });
  });

  it('should update items on PUT', function() {
      const updateData = {
        title: 'This is the updated Title',
        content: 'This is updated content',
        author: 'This is the updated author'
      };
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          updateData.id = res.body[0].id;
          var url = '/blog-posts/' + updateData.id;
          return chai.request(app)
            .put(url)
            .send(updateData)
        })
        .then(function(res) {
          res.should.have.status(204);
          //res.should.be.json;
          //res.body.should.be.a('object');
          //res.body.should.deep.equal(updateData);
        });
    });

    it('should delete items on DELETE', function() {
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function(res) {
              res.should.have.status(204);
            });
        });

    });

});