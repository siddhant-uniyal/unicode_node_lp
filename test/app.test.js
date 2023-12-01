const request = require("supertest")
const mongoose = require("mongoose")
const {app} = require("../app.js")
const User = require("../models/User.js")
const Answer = require("../models/Answer.js")
const Question = require("../models/Question.js")
const Comment = require("../models/Comment.js")
const { connectToDB } = require("../data/db.js")
const { response } = require("express")

connectToDB();
// const testUser1 = {
//     _id : new mongoose.Types.ObjectId(),

//     name : 'testUser1Normal',
//     email : 'testUser1@gmail.com',
//     password : '12345678',
//     followers : [],
//     following : [],
//     answers : [],
//     questions : [],
//     comments : [],
//     views : [],
//     auth : 'Normal',
//     education : 'Graduate',
//     profilePictureCloudinary : "",
// }

let testUser1token = "";
let testUser1ID = "" ;

// const testUser2 = {
//     _id : new mongoose.Types.ObjectId(),

//     name : 'testUser2Admin',
//     email : 'testUser2@gmail.com',
//     password : '12345678',
//     followers : [],
//     following : [],
//     answers : [],
//     questions : [],
//     comments : [],
//     views : [],
//     auth : 'Admin',
//     education : 'Graduate',
//     profilePictureCloudinary : "",
// }


let testUser2token = "";
let testUser2ID = "";

const updateDB = async()=>{
await User.deleteMany({});
await Answer.deleteMany({});
await Question.deleteMany({});
await Comment.deleteMany({});
// await User(testUser1).save();
// await User(testUser2).save();
}

const timing = async()=>{
    await updateDB()
}

timing()

test('register test for normal user' , async() => {
    const response = await request(app)
    .post("/register")
    .send({
        name : "testuser2",
        email : "testuser2@gmail.com",
        password : "12345678",
        auth : "Normal"
    }).expect(200);

    testUser2ID = response.body.user._id;
    console.log("Test User 2 ID" , testUser2ID);
    
})

test('register test for admin' , async() => {
    const response = await request(app)
    .post("/register")
    .send({
        name : "testuser1",
        email : "testuser1@gmail.com",
        password : "12345678",
        auth : "Admin",
    }).expect(200)

    testUser1ID = response.body.user._id;
    console.log("Test User 1 ID" , testUser1ID);
   
})


test('login test for normal user' , async() => {
    const response = await request(app)
    .post("/login")
    .send({
        email : "testuser2@gmail.com",
        password : "12345678"
    }).expect(200)

    testUser2token = response.body.authToken;


    console.log("Test User 2 Token" ,testUser2token);
    
})

test('login test for admin' , async() => {
    const response = await request(app)
    .post("/login")
    .send({
        email : "testuser1@gmail.com",
        password : "12345678"
    }).expect(200)

    testUser1token = response.body.authToken;
    console.log("Test User 1 Token" , testUser1token);
    
})

test('view profile test' , async()=>{

    await request(app)
    .get("/myprofile")
    .set("authToken" , testUser1token)
    .expect(200)
})

test('follow someone test' , async() => {
    await request(app)
    .post(`/follow/${testUser2ID}`)
    .set("authToken" , testUser1token)
    .expect(200)
})

test('unfollow someone test' , async() => {
    await request(app)
    .post(`/unfollow/${testUser2ID}`)
    .set("authToken" , testUser1token)
    .expect(200)
})

test('upload profile pic test' , async() => {
    await request(app)
    .post("/uploadpic")
    .set("authToken" , testUser1token)
    .attach('file',("D:/unicode_node_lp/test/testProfilePic.png"))
    .expect(200)
})

let testQuestion1ID = "";

test('ask question test' , async() => {
    const response = await request(app)
    .post("/question/post")
    .set("authToken" , testUser1token)
    .send({
        question : "Test Question 1",
        category : "Engineering"
    }).expect(200)

    testQuestion1ID = response.body.postedQuestion._id;
    console.log("Test Question 1 ID" , testQuestion1ID);
})

test('get question test' , async() => {
    await request(app)
    .get("/question/get")
    .set("authToken" , testUser1token)
    .expect(200)
})

test('update question test' , async() => {
    await request(app)
    .put(`/question/${testQuestion1ID}`)
    .set("authToken" , testUser1token)
    .send({
        question : "Test Question 1 Updated",
        category : "Engineering"
    }).expect(200)
})

test('search questions by category test' , async() => {
    await request(app)
    .get("/question/search")
    .set("authToken" , testUser1token)
    .send({
        categories : ["Engineering"]
    })
    .expect(200)
})

test('upvote question test' , async() => {
    await request(app)
    .post(`/question/upvote/${testQuestion1ID}`)
    .set("authToken" , testUser1token)
    .expect(200)
})


test('downvote question test' , async() => {
    await request(app)
    .post(`/question/downvote/${testQuestion1ID}`)
    .set("authToken" , testUser1token)
    .expect(200)
})

test('normal user delete question test' , async() => {
    await request(app)
    .delete(`/question/${testQuestion1ID}`)
    .set("authToken" , testUser2token)
    .expect(400)
})

test('admin delete question test' , async() => {
    await request(app)
    .delete(`/question/${testQuestion1ID}`)
    .set("authToken" , testUser1token)
    .expect(201)
})

let testAnswer1ID = "";

test('give answer' , async() => {
    const response = await request(app)
    .post(`/answer/${testQuestion1ID}`)
    .set("authToken" , testUser1token)
    .send({
        answer : "Test Answer 1"
    })
    .expect(200)
    console.log(testQuestion1ID)
    testAnswer1ID = response.body.createdAnswer._id
    
    console.log("Test Answer 1 ID " , testAnswer1ID);
})

test('get answers test' , async() => {
    await request(app)
    .get("/answer/get")
    .set("authToken" , testUser1token)
    .expect(200)
})

test('update answer test' , async() => {
    await request(app)
    .put(`/answer/${testAnswer1ID}`)
    .set("authToken" , testUser1token)
    .send({
        answer : "Test Answer 1 Updated"
    })
    .expect(200)

    console.log(testAnswer1ID)
})

test('upvote answer test' , async() => {
    await request(app)
    .post(`/answer/upvote/${testAnswer1ID}`)
    .set("authToken" , testUser1token)
    .expect(200)

    console.log(testAnswer1ID)
})


test('downvote answer test' , async() => {
    await request(app)
    .post(`/answer/downvote/${testAnswer1ID}`)
    .set("authToken" , testUser1token)
    .expect(200)

    console.log(testAnswer1ID)
})

test('normal user delete answer test' , async() => {
    await request(app)
    .delete(`/answer/${testAnswer1ID}`)
    .set("authToken" , testUser2token)
    .expect(400)

    console.log(testAnswer1ID)
})

test('admin delete answer test' , async() => {
    await request(app)
    .delete(`/answer/${testAnswer1ID}`)
    .set("authToken" , testUser1token)
    .expect(201)

    console.log(testAnswer1ID)
})

let testComment1ID = "";
let testComment2ID = "";

test('post comment on question test' , async() => {
    const response = await request(app)
    .post(`/comment/${testQuestion1ID}`)
    .set("authToken" , testUser1token)
    .send({
        comment : "Test Comment 1",
        parentType : "Question"
    })
    .expect(200)

    testComment1ID = response.body.createdComment._id
    console.log("Test Comment 1 ID" , testComment1ID);

})


test('post comment on answer test' , async() => {
    const response = await request(app)
    .post(`/comment/${testAnswer1ID}`)
    .set("authToken" , testUser1token)
    .send({
        comment : "Test Comment 2",
        parentType : "Answer"
    })
    .expect(200)

    testComment2ID = response.body.createdComment._id
    console.log("Test Comment 2 ID" , testComment2ID);
})

test('get comments test' , async() => {
    await request(app)
    .get("/comment/get")
    .set("authToken" , testUser1token)
    .expect(200)
})

test('update comment test' , async() => {
    await request(app)
    .put(`/comment/${testComment1ID}`)
    .set("authToken" , testUser1token)
    .send({
        comment : "Test Comment 1 Updated"
    })
    .expect(201)
})

test('upvote comment test' , async() => {
    await request(app)
    .post(`/comment/upvote/${testComment1ID}`)
    .set("authToken" , testUser1token)
    .expect(201)
})


test('downvote comment test' , async() => {
    await request(app)
    .post(`/comment/downvote/${testComment1ID}`)
    .set("authToken" , testUser1token)
    .expect(201)
})

test('normal user delete comment test' , async() => {
    await request(app)
    .delete(`/comment/${testComment1ID}`)
    .set("authToken" , testUser2token)
    .expect(401)
})

test('admin delete comment test' , async() => {
    await request(app)
    .delete(`/comment/${testComment1ID}`)
    .set("authToken" , testUser1token)
    .expect(201)
})





