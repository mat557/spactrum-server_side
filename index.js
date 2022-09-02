const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');



app.use(cors());
app.use(express.json());
 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xtbdwt7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        await client.connect();
        
        // const courseCollection = client.db('spectrum-course-collection').collection('courses');


        // app.get("/courses", async(req,res)=>{
        //     const query = {};
        //     const cursor = courseCollection.find({});
        //     const result = await cursor.toArray();
        //     res.status(200).send(result);
        // });


        const userCollection = client.db('spectrum-collection').collection('users');
        const courseCollection = client.db('spectrum-collection').collection('courses');
        const enroleCollection = client.db('spectrum-collection').collection('enrole');
        const commentCollection = client.db('spectrum-collection').collection('comment');
        const blogCollection = client.db('blog-collection').collection('blog');
       
     
     
        app.put('/users/:email',async(req,res)=>{
          const email = req.params.email;
          const user = req.body;
          const filter = {email:email}
          const options = { upsert : true}
          const updateDoc = {
            $set:user,
          }
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send(result);
        });
     
     
        app.get('/courses',async(req,res)=>{
          const result = await courseCollection.find().toArray()
          res.send(result);
        });
     
        app.patch('/update/:email',async(req,res)=>{
          const email = req.params.email;
          const update = req.body;
          const filter = {email : email};
          const options = {upsert : true};
          const updateDoc = {
            $set : update,
          }
          const result = await userCollection.updateMany(filter,updateDoc,options)
          res.send(result)
        });
     
        //this is for the add comment section
        app.get('/getUser/:email',async(req,res)=>{
          const email = req.params.email;
          const query = {email : email};
          const result = await userCollection.findOne(query);
          res.send(result);
        })
     
        app.get('/profile/:email',async(req,res)=>{
          const email = req.params.email;
          const query = { email : email};
          const user = await userCollection.findOne(query);
          res.send(user);
        });
     
        app.get('/singleCourse/:id' , async(req,res)=>{
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const course = await courseCollection.findOne(query);
          res.send(course);
        });
     
     
        app.put('/enroleOne',async(req,res)=>{
          const data = req.body;
          const added = await enroleCollection.insertOne(data);
          res.send(added);
        });
     
        app.get('/allEnrole',async(req,res)=>{
          const result = await enroleCollection.find().toArray();
          res.send(result);
        });
     
        app.patch('/comment/:email',async(req,res)=>{
           const email = req.params.email;
           const data = req.body;
           const filter = {email : email}
           const options = {upsert : true}
           const updatedDoc = {
            $set : data,
           }
           const result = await commentCollection.updateMany(filter,updatedDoc,options);
           res.send(result);
        });
     
     
        //get all comment for home comment
        app.get('/comment',async(req,res)=>{
          const page = parseInt(req.query.page);
          const size = 3;
          const query = {};
          const cursor = commentCollection.find(query);
          let comments;
          if(size || page){
            comments = await cursor.skip(page * size).limit(size).toArray();
          }
          else{
            comments = await cursor.toArray();
          }
          res.send(comments);
        })
     
        //home comment
        app.get('/commentCount',async(req,res)=>{
          const query = {};
          const cursor = commentCollection.find(query);
          const count = await cursor.count();
          res.json(count);
        });
     
     
        //home course and get course by id for use params
     
        app.get('/courseById/:id', async(req,res)=>{
          const tag = req.params.id;
          const id = {_id : ObjectId(tag)}
          const course = await courseCollection.findOne(id);
          res.send(course);
        });
     
        //
     
        app.patch('/updateSingle/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const value = req.body;
            console.log('value lne 150',value)
            const options = { upsert: true };
            const updateDoc = {
              $set:   value,
            };
            const result = await courseCollection.updateOne(filter,updateDoc,options);
            res.status(200).json(result);
        })
     
     
        // app.get('/')
     
        //for modal for home
        app.put('/addCourse', async(req,res)=>{
          const data = req.body;
          const result = await enroleCollection.insertOne(data);
          res.send(result);
        });
     
     
        //this for home course enroled item
        app.get('/getEnroled/:serial',async(req,res)=>{
          const parameter = req.params.serial;
          const filter = {serial : parameter};
          const result = await enroleCollection.findOne(filter);
          res.send(result);
        });
     
        //this api for dashboard admin to see all user
        app.get('/allUser',async(req,res)=>{
          const result = await userCollection.find().toArray();
          res.send(result);
        });
     
     
        //dashboard add course
     
        app.put('/course', async(req,res)=>{
          const course = req.body;
          const result =  courseCollection.insertOne(course);
          res.send(result);
        });
     
     
        //posting a blog dashbobard
        app.put('/blogPost',async (req,res)=>{
          const blog = req.body;
          const result = blogCollection.insertOne(blog);
          res.send(result);
        });
     
        //get all the blog
        app.get('/blog',async(req,res)=>{
          const result = await blogCollection.find().toArray();
          res.send(result);
        });
 
        
    }
    finally{}
}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Response from server of Spectrum CC!')
});

app.listen(port,()=>{
    console.log(`Running Spectrum CC server at port :${port}`);
})