const faker = require('faker');
const request = require('sync-request');
const _ = require('lodash');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const postCache = []

function getPostFromTheMatrix() {
  // const res = request('GET', 'https://jaspervdj.be/lorem-markdownum/markdown.txt');
  // return res.getBody().toString();
  return "jijijijijijiji"
}

function getPostBody() {
  if(postCache.length < 5) {
    console.log("Getting a new post");
    const post = getPostFromTheMatrix();
    postCache.push(post);
    return post;
  } else {
    return _.sample(postCache);
  }
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getUsers() {
  return [
    {
      id: 1,
      name: faker.name.findName()
    }
  ];
}

function getPosts(amount = 100) {
  const posts = [];
  for (let i = 0; i < amount; i++) {
    const date = faker.date.recent(amount);
    const body = getPostBody() || "";
    posts.push({
      id: i + 1,
      user_id: 1,
      updated_at: date,
      inserted_at: date,
      tag_ids: _.uniq([getRandomArbitrary(1,10), getRandomArbitrary(1,10), getRandomArbitrary(1,10), getRandomArbitrary(1,10)]),
      title: faker.lorem.sentence(),
      body: body,
      excerpt: body.substring(0,100)
    });
  }
  return posts;
}

function getWords(amount = 10) {
  const words = [];
  for (let i = 0; i < amount; i++) {
    words.push({
      id: i + 1,
      name: faker.lorem.word()
    });
  }
  return words;
}

function giveMeMyData() {
  return {
    users: getUsers(),
    posts: getPosts(),
    pages: getPosts(5),
    tags: getWords(),
    categories: getWords()
  };
}

/// KEEP OUT!! SERVER SHIT!

var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router(giveMeMyData())
var middlewares = jsonServer.defaults()

router.render = function (req, res) {
  const rawData = res.locals.data;
  const responseObject = _.isArray(rawData)? rawData[0] : rawData;

  console.log(res.header()._headers.link)

  const serializer = new JSONAPISerializer('users', {
    attributes: Object.keys(responseObject)
  });
  const serialized_data = serializer.serialize(rawData);
  res.jsonp(serialized_data);
}

server.use(middlewares)
server.use(router)
server.listen(2000, function () {
  console.log('JSON Server is running')
})
