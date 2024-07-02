require('dotenv').config();

const crypto = require('crypto');
const Razorpay = require('razorpay');
const express = require('express');
const mysql = require('mysql2');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const app = express();
const cookieParser = require("cookie-parser")
const port = 3001;
const cors = require('cors')
const multer = require('multer')
app.use(express.json())
app.use(cors());
const path = require("path");
app.use(cookieParser())
const {promisify} = require('util')
app.use(express.urlencoded({extended: true}));
const sharedData = require('./sharedData');

const storage = multer.diskStorage({
  destination: './images',
  filename: (req, file, cb) => {
    console.log(file);
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
// Replace these with your MySQL database connection details


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});
// const db2 = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'nodejs-login',
//   port:8889
// });
app.use('/images', express.static('images'));


// Connect to MySQL database
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//   } else {
//     console.log('Connected to MySQL database');
//   }
// });



app.get("/api/getkey", (req, res) => {
  try {
    // Check if RAZORPAY_API_KEY environment variable is set
    if (!process.env.RAZORPAY_API_KEY) {
      throw new Error("RAZORPAY_API_KEY environment variable is not set.");
    }
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
  } catch (error) {
    console.error("Error retrieving Razorpay key:", error);
    res.status(500).json({ error: "Failed to retrieve key" }); // Send a generic error to client
  }
});


app.post('/api/checkout', async(req, res) => {
  try {
    const amount =Math.floor(Number(req.body.amount)*100); // Validate amount
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount provided.");
    }
     console.log(amount)
     sharedData.setAmount(amount);

     const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET
    });

    const options = {
      amount,
      currency: "INR"
    };

  const order = await instance.orders.create(options);// Assuming 'instance' is your Razorpay instance

    return res.json({
      Status:true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(700).json({ error: error.message || "Failed to create order" }); // Send a more specific error message if possible
  }
});

//storing data to shipping address table
app.post('/api/storeshippingaddress',async (req, res) => {
  try {
    console.log("API hitting")
    // Authentication and data extraction
   // const success =false;
    const token = req.headers['auth-token'];
    if (!token) {
      throw new Error('Unauthorized: Missing auth token');
    }

    const decoded = jwt.verify(token, "mysupersecretpassword"); // Replace with your secret
    const customer_id = decoded.id;

    const checkDuplicateSql = `
    SELECT * FROM shipping_address
    WHERE customer_id = ? AND address_line1 = ? AND city = ? AND postal_code = ?
`;
db.query(checkDuplicateSql, [customer_id, addressLine1, city, postalCode], (err, existingAddresses) => {
  if (err) {
      throw err;
  }
  if (existingAddresses.length > 0) {
    // Address already exists, handle the case (e.g., send an error message)
    res.status(409).json({ error: 'Duplicate address found. Please enter a unique address.' });
} else {

    const {
      firstName,
      lastName,
      addressLine1, // Use address_line1 from schema
      addressLine2, // Use address_line2 from schema
      city,
      state,
      postalCode, // Use postal_code from schema
      phoneNumber,
      is_default = 0
    } = req.body;

    // Validate input data (optional, can be improved)
    if (!customer_id || !firstName || !lastName || !addressLine1 || !city || !postalCode) {
      throw new Error('Missing required fields');
    }

    // Database interaction
    const sql = `
      INSERT INTO shipping_address (
        customer_id,
        first_name,
        last_name,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        phone_number,
        is_default
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      customer_id,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      phoneNumber,
      is_default
    ], (err, result) => {
      if (err) {
        throw err; // Re-throw the error for handling in the catch block
      }

      ship_id = db.query(`SELECT shipping_address_id
        FROM shipping_address
        WHERE customer_id = ?
        ORDER BY created_at DESC
        LIMIT 1`,customer_id);
      sharedData.setid(ship_id);
      
      res.json({ success: true, message: 'Shipping address stored successfully' });
    });
  }
});
  } catch (error) {
    console.error(error);
    res.status(800).json({ error: error.message || 'Failed to store shipping address' });
  }
});


// app.post('/api/paymentverification',(req,res)=>{
//   console.log(req.body);
//   //console.log(process.env.RAZORPAY_API_SECRET);
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//     res.status(400).json({
//       success: false,
//       error: 'Missing  payment information.'
//     });
//   }
//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256",process.env.RAZORPAY_API_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//   //   // Database comes here

//   //    Payment.create({
//   //     razorpay_order_id,
//   //     razorpay_payment_id,
//   //     razorpay_signature,
//   //   });

//     res.redirect(
//       `http://localhost:3001/paymentsuccess?reference=${razorpay_payment_id}`
//     );
//   } else {
//     res.status(400).json({
//       success: false,
//     });
//   }
// }
// );

// app.post('/api/paymentverification', (req, res) => {
//   try {

//   console.log("kch to aaye",req.body);

//   // const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   // console.log("information",razorpay_order_id,razorpay_payment_id,razorpay_signature)
//   // if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//   //   return res.status(400).json({
//   //     success: false,
//   //     error: 'Missing payment information.',
//   //   });
//   // }
//   // const expectedSignature = crypto
//   //   .createHmac("sha256", "dKndWbYgPJHgFRoQRpr4VjHY")
//   //   .update(razorpay_order_id + "|" + razorpay_payment_id)
//   //   .digest("hex");

//   // const isAuthentic = expectedSignature === razorpay_signature;

//   // Logic to handle payment verification and update order status (replace "..." with your code)
//   // let verificationResult;
//   // try {
//   //   // ... (your payment verification logic using Razorpay API)
//   //   verificationResult = { success: true, message: "Payment verified" };
//   // } catch (error) {
//   //   verificationResult = { success: false, error: error.message };
//   // }

//   // Send the final response only once
//  // res.status(200).json(verificationResult);
// }catch (error) {
//     console.log(error);
//   }
// });
app.post('/api/paymentverification',(req,res)=>{
  try {
    
    console.log("header",req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "dKndWbYgPJHgFRoQRpr4VjHY")
      .update(body.toString())
      .digest("hex");
    
    const isAuthentic = razorpay_signature === expectedSignature;
 
    // if (isAuthentic) {
    //   //database comes here
    //     // conn.query("SELECT ID FROM Customers WHERE UserID=?",[bookingDatas.userId], (err, rows, fields) => {
    //     //   const CustomerID = rows[0].ID;
    //     //   console.log("CustomerId",CustomerID)
    //     //       conn.query("INSERT INTO saloon.appointments(CustomerID,BranchID,Date,Status,SlotTime)VALUES(?,?,?,'Booked',?)",[CustomerID,bookingDatas.branchId,bookingDatas.date,bookingDatas.slot],(err,rows,fields)=>{
    //     //           if(!err)
    //     //           {
    //     //               console.log("Rows",rows)
    //     //               if(Array.isArray(bookingDatas.services)){
    //     //                   bookingDatas.services.forEach(element => {
    //     //                       console.log("Services into database ",element)
    //     //                       conn.query("INSERT INTO AppointmentServices(AppointmentID, ServiceID) VALUES(?,?)", [rows.insertId, element.sId], (err,rows, fields)=>{
    //     //                           if(err){
    //     //                               console.log(err);
    //     //                           }
    //     //                       })
                              
    //     //                   });
    //     //               }
    //     //               else {
    //     //                   conn.query("INSERT INTO AppointmentServices (AppointmentID, ServiceID) VALUES(?,?)", [rows.insertId, bookingDatas.services.sId], (err,rows, fields)=>{})
    //     //               }
    //     //               // conn.query("select sum(ser.Price) as TotalPrice from appointmentservices as apSer join services as ser on apSer.ServiceID=ser.sId where AppointmentID=?",[rows.insertId],(err,serAmount,fields)=>{
    //     //                   conn.query("INSERT INTO payments(AppointmentID,Amount,PaymentMode)values(?,?,?)",[rows.insertId,bookingDatas.totalAmount,bookingDatas.paymentMode],(err,ser,fields)=>{
    //     //                       if(err){
    //     //                           console.log(err);
    //     //                       }
    //     //                       else{
    //       //                       }   
    //       //                   })
    //       //               // })
          
    //       //           }
    //       //     else{
    //         //         console.log(err);
    //         //     }                
    //         // })
            
    //         //   }
            
            
            
    //       //   res.redirect(http://localhost:3001/paymentsuccess?reference=${razorpay_payment_id}
    //        } 
    if(isAuthentic){
  
      res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    }
          else {
            // console.log("verification",req.body)
            return res.json({ Status: false });
    }
  } catch (error) {
    console.log(error);
  }
})


app.post('/api/add',(req,res)=>{
  let product = req.body;
  let success = false;
  // console.log(product)
  // console.log("request coming")
  // const query = "INSERT INTO product (name,image_url,category,price,offer_price,description,stock_quantity,manufacturer,weight) values(?,?,?,?,?,?,?,?)";
  db.query("INSERT INTO product set ?",{name :product.name,image_url: product.image ,category :product.category,price :product.price,offer_price :product.offer_price,description:product.description,stock_quantity:product.stock_quantity,manufacturer:product.manufacturer,weight:product.weight},(err,results)=>{
      if(!err){
        success = true;
          return res.status(200).json({success:success ,message:"Product Added Successfully!"});
      }
      return res.status(500).json({err});
  })
})
const upload = multer({storage: storage})

app.post("/upload",upload.single('product') ,(req,res)=>{
  res.json({
    success: 1,
    image_url: `http://localhost:3001/images/${req.file.filename}`
})
})
// Define a route to fetch products from the database
app.get('/api/products', (req, res) => {
  // const query = 'SELECT * from Product inner join product_categories on Product.product_id = product_categories.product_id inner join Categories on product_categories.category_id = Categories.category_id;';
  const query = 'SELECT * from Product ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying MySQL database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});
app.post('/api/productsbycategory', (req, res) => {
  const { category_id } = req.body;
  console.log("request comming in category ")
  // const query = 'SELECT * from Product inner join product_categories on Product.product_id = product_categories.product_id inner join Categories on product_categories.category_id = Categories.category_id;';
  const query = 'select * from Product inner join product_categories on Product.product_id = product_categories.product_id inner join Categories on product_categories.category_id = Categories.category_id and Categories.category_id=? limit 5;';
  db.query(query,[category_id],(err, results) => {
    if (err) {
      console.error('Error querying MySQL database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(results)
      res.json(results);
    }
  });
});
app.get('/api/catproducts', (req, res) => {
  const query = 'SELECT * from Product inner join product_categories on Product.product_id = product_categories.product_id inner join Categories on product_categories.category_id = Categories.category_id;';
  // const query = 'SELECT * from Product ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying MySQL database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * from categories';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying MySQL database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/api/customer', (req, res) => {
    
  var query = "select * from customer";
  db.query(query, (err, results) => {
      if (!err) {
          return res.status(200).json(results);
      }
      else {
          return res.status(500).json(err);
      }
  })
})
// router.post('/add',auth.authenticateToken,(req,res)=>{
//   let product = req.body;
//   var query = "INSERT INTO product (name,category_id,description,price) values(?,?,?,?)";
//   db.query(query,[product.name,product.category_id,product.description,product.price],(err,results)=>{
//       if(!err){
//           return res.status(200).json({message:"Product Added Successfully!"});
//       }
//       return res.status(500).json({err});
//   })
// })

// app.post('/login', async (req, res) => {
//   console.log("request coming");
//   let success = false;
//   console.log(req.body);

//   try {
//     const { email, password } = req.body;

//     if (!email) {
//       return res.status(400).json({ success, errors: "please enter the email" });
//     }
//     if (!password) {
//       return res.status(400).json({ success, errors: "please enter the password" });
//     }

//     const [results] = await db.query('select * from customer where email = ?', [email]); // Use await directly

//     if (!results || !(await bcrypt.compare(password, results[0].password))) {
//       res.status(401).json({
//         errors: 'email id or password is incorrect'
//       });
//     } else {
//       success = true;
//       const id = results[0].customer_id;
//       const token = jwt.sign({ id }, "mysupersecretpassword", {
//         expiresIn: "90d"
//       });
//       console.log("The token is " + token);

//       // Choose your preferred approach for sending the token (comment out the other):

//       // 1. Send token in response body:
//       res.json({ success, token });

//       // 2. Send token as a cookie (uncomment and adjust cookie options):
//       // const cookieOptions = {
//       //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//       //   httpOnly: true
//       // };
//       // res.cookie('jwt', token, cookieOptions);

//       console.log("login completed");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ errors: "Internal server error" }); // Handle errors gracefully
//   }
// });

app.post('/login',async  (req,res)=>{
  // console.log("request coming")
  let success = false;
  console.log(req.body)
  try {
      const { email , password } = req.body;
      if(!email )
      {
          return res.status(400).json({success: success, errors: "please enter the email" })
      }
      if(!password)
      {
          return res.status(400).json({success: success, errors: "please enter the password"})
      }
       db.query('select * from customer where email = ?',[email],async( err , results)=>{
          console.log(results);
          if(!results || results.length==0) 
          {
             return res.status(401).json({
                  errors : 'email id or password is incorrect'
          })
          } 
          else if (!( await bcrypt.compare(password , results[0].password))) // to compare the hashed password with the password present in req.body
          {
             return res.status(401).json({
                  errors : 'email id or password is incorrect'
          })
          } 
          
          else
             { 
              success = true;
              const id = results[0].customer_id ; // {id : id } can be used but both are same thats why only id is used 
              const token = jwt.sign({id} , "mysupersecretpassword" ,{    // 1. making token using jasonWebToken 
                  expiresIn : "90d" 
              })
              const firstname = results[0].first_name;
              console.log("The token is " + token); // token will be sent as a cookie , cookie and token will be same 

              // const cookieOptions = {       // setting cookies specifications 
              //     expiresIn : new Date(
              //         Date.now + 90 * 24 * 60 * 60 * 1000 
              //     ),
              //     httpOnly : true 
              // }
              res.json({ success, token, firstname ,id}) ;

              // res.cookie('jwt',token , cookieOptions )  // using token to create and sending cookie 
                                                      // name of cookie is jwt and value of cookie is token 
              // res.status(200).redirect("/")       // redirect to the home page 

              console.log("login completed")
             }

      })
  } catch (err) {
      
  }
});  

app.post('/updateprofile',async  (req,res)=>{
  // console.log("request coming")
  let success = false;
  const { firstname , lastname,phonenumber, email ,id} = req.body
  console.log(req.body)
  const emptyFields = [];
  if (!firstname) {
    emptyFields.push("First Name");
  }
  if (!lastname) {
    emptyFields.push("Last Name");
  }
  if (!phonenumber) {
    emptyFields.push("Phone Number");
  }
  if (!email) {
    emptyFields.push("Email");
  }
  if (emptyFields.length > 0) {
    res.status(400).json({
      errors: `Please fill in the following required fields: ${emptyFields.join(', ')}`,
    });
    return; // Return early to prevent further execution
  }
  try {
      
       db.query('select * from customer where customer_id = ?',[id],async( err , results)=>{
          console.log(results);
          if(!results || results.length==0) 
          {
             return res.status(401).json({
                  errors : 'user doesnt exist'
          })
          } 
          else
             { 
              db.query('update Customer set first_name=?, last_name =? ,email=?,phone_number=?  where customer_id=?;',[firstname ,lastname,email,phonenumber,id],(err,results)=>{
                if(err){
                    console.log(err)
                }
                else
                {
                    console.log(results)
                    res.json({
                        message: 'user updated',
                        success:true
                    });
                }
            })
             }

      })
  } catch (err) {
      
  }
});  

app.get('/api/orders', (req, res) => {
    
  var query = "select * from orders";
  //var query = "select customer.first_name, product.name from customer join product ON customer.customer_id = product.customer_id";
  
  db.query(query, (err, results) => {
      if (!err) {
          return res.status(200).json(results);
      }
      else {
          return res.status(500).json(err);
      }
  })
})
app.post('/api/orderid', (req, res) => {
  console.log("req coming")
  const token = req.headers['auth-token'];
  if (!token) return res.status(401).send({ message: 'Unauthorized: Missing auth token' });
  const decoded = jwt.verify(token, "mysupersecretpassword"); // Synchronous function 
  const customerId = decoded.id;


  var query = "select * from orders where customer_id =?";

  
  db.query(query,[customerId], (err, results) => {
      if (!err) {
          return res.status(200).json(results);
      }
      else {
          return res.status(500).json(err);
      }
  })
})

app.get('/api/order', (req, res) => {
  // var query = "select * from orders";

  var query = "SELECT (@row_number := @row_number + 1) AS sr_no ,c.first_name AS customer_name , c.last_name AS customer_surname, p.name AS product_name, o.total_amount, o.status, o.order_date FROM Orders o INNER JOIN Customer c ON o.customer_id = c.customer_id INNER JOIN order_items oi ON o.order_id = oi.order_id INNER JOIN Product p ON oi.product_id = p.product_id CROSS JOIN (SELECT @row_number := 0) AS dummy ORDER BY o.order_date;";
  db.query(query, (err, results) => {
    if (!err) {
        return res.status(200).json(results);
    }
    else {
      console.log(err)
        return res.status(500).json(err);
    }
})
   } );


app.post('/signup',async  (req,res)=>{
// console.log("request coming")
  const { firstname , lastname, address ,zipcode ,phonenumber, email , password } = req.body
  const emptyFields = [];
if (!firstname) {
  emptyFields.push("First Name");
}
if (!lastname) {
  emptyFields.push("Last Name");
}
if (!address) {
  emptyFields.push("Address");
}
if (!zipcode) {
  emptyFields.push("Zip Code");
}
if (!phonenumber) {
  emptyFields.push("Phone Number");
}
if (!email) {
  emptyFields.push("Email");
}
if (!password) {
  emptyFields.push("Password");
}

// Handle empty fields
if (emptyFields.length > 0) {
  res.status(400).json({
    errors: `Please fill in the following required fields: ${emptyFields.join(', ')}`,
  });
  return; // Return early to prevent further execution
}

  db.query('select email from customer where email=?',[email], async (err, results) => {
    if (err) {
        console.log("error")
    } else {
        if (results && results.length > 0) {
            res.json({
                errors : 'That email is already in use '
            });
        } 
         else {
            // Hash the password only if the email is not in use and passwords match
            let hashPassword = await bcrypt.hash(password, 8); // encrypting the password using bcrypt 
            console.log(hashPassword);
                                                // it doesnt matter what is the order of keys just key should match with the column name
            db.query('insert into customer set ?',{first_name : firstname , last_name: lastname,address : address, zip_code : zipcode,phone_number:phonenumber, password : hashPassword , email : email},(err,results)=>{
                if(err){
                    console.log(err)
                }
                else
                {
                    console.log(results)
                    res.json({
                        message: 'user registered',
                        success:true
                    });
                }
            })

            // Continue with the rest of your code...
        }
    }
});
})

// app.post('/addtocart', async (req, res) => {
//   // 1. Verify JWT token
//   console.log("request coming ")
//   const token = req.headers['auth-token'];
//   if (!token) return res.status(401).send({ message: 'Unauthorized: Missing auth token' });

//   try {
//     const decoded = jwt.verify(token, "mysupersecretpassword"); // Replace with your secret
//     const customerId = decoded.id;

//     // 2. Find cart ID for the customer
//     const [rows] = await db.query('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId]);
//     let cartId;
//     if (rows.length === 0) {
//       // Create a new cart if customer doesn't have one
//       const [newCartResult] = await db.query('INSERT INTO Cart (customer_id, cart_name) VALUES (?, ?)', [customerId, 'My Cart']);
//       cartId = newCartResult.cart_id;
//     } else {
//       cartId = rows[0].cart_id;
//     }

//     // 3. Extract item ID from request body
//     const { itemId } = req.body;
//     if (!itemId) return res.status(400).send({ message: 'Missing item ID in request body' });

//     // 4. Check if item exists (optional, depending on your logic)
//     const [itemExists] = await db.query('SELECT * FROM product WHERE product_id = ?', [itemId]);
//     if (itemExists.length === 0) return res.status(404).send({ message: 'Product not found' });

//     // 5. Add item to cart (assuming no existing entry for this product)
//      db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, itemId, 1]); // Modify quantity if needed

//     res.status(200).send({ message: 'Item added to cart successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Internal server error' });
//   }
// });

app.post('/addtocart', async (req, res) => {
  // 1. Verify JWT token
  console.log("request coming aagain ")
  const token = req.headers['auth-token'];
  if (!token) return res.status(401).send({ message: 'Unauthorized: Missing auth token' });

  try {
    const decoded = jwt.verify(token, "mysupersecretpassword"); // Synchronous function 
    // asnchronous function is also available in jsonwebtoke : verifySync which will take a callback function which will be executed after the 
    // function complition 
    
    const customerId = decoded.id;

    // 2. Find cart ID for the customer
    const findCartId = (callback) => {
      db.query('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId], (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(null, rows.length === 0 ? null : rows[0].cart_id);
      });
    };

    let cartId;
    await new Promise((resolve, reject) => {
      findCartId((error, id) => {
        if (error) {
          return reject(error);
        }
        cartId = id;
        resolve();
      });
    });

    if (!cartId) {
      // Create a new cart if customer doesn't have one
      const createCart = (callback) => {
        db.query('INSERT INTO Cart (customer_id, cart_name) VALUES (?, ?)', [customerId, 'My Cart'], (err, result) => {
          if (err) {
            return callback(err);
          }
          callback(null, result.insertId);//return cart_id 
        });
      };

      await new Promise((resolve, reject) => {
        createCart((error, id) => {
          if (error) {
            return reject(error);
          }
          cartId = id;
          resolve();
        });
      });
    }

    // 3. Extract item ID from request body
    const { itemId , quantity} = req.body;
    if (!itemId) return res.status(400).send({ message: 'Missing item ID in request body' });

    // 4. Check if item exists (optional, depending on your logic)
    const checkItem = (callback) => {
      db.query('SELECT * FROM product WHERE product_id = ?', [itemId], (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(null, rows.length === 0 ? null : rows);
      });
    };

    let itemExists;
    await new Promise((resolve, reject) => {
      checkItem((error, data) => {
        if (error) {
          return reject(error);
        }
        itemExists = data;
        resolve();
      });
    });

    if (!itemExists) return res.status(404).send({ message: 'Product not found' });
    const checkCartItem = (callback) => {
      db.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',[cartId, itemId], (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(null, rows.length === 0 ? null : rows);
      });
    };
    let cartItemExists;
    await new Promise((resolve, reject) => {
      checkCartItem((error, data) => {
        if (error) {
          return reject(error);
        }
        cartItemExists = data;
        resolve();
      });
    });
    if(cartItemExists){
      db.query('UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?', [quantity , cartItemExists[0].cart_item_id], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Internal server error' });
        }
        res.status(200).send({ message: 'Item added to cart successfully' });
      });
    }
    else{
    // 5. Add item to cart (assuming no existing entry for this product)
    db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, itemId, quantity], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
      }
      res.status(200).send({ message: 'Item added to cart successfully' });
    });}
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.post('/getcart',async (req, res)=>{
  // console.log("request coming ")
  const token = req.headers['auth-token'];
  // check if there is login or not
  if (!token) return res.status(401).send({ message: 'Unauthorized: Missing auth token' });

  try {
    const decoded = jwt.verify(token, "mysupersecretpassword"); // Replace with your secret
    const customerId = decoded.id;

     // as we are getting resp from the database which has to return but if  you don't want to return and also 
    // want to store the result and it should move only when it has been fetched then use callback promise

    const findCartId = (callback) => {
      db.query('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId], (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(null, rows.length === 0 ? null : rows[0].cart_id);
      });
    };

    let cartId;

    await new Promise((resolve, reject) => {
      findCartId((error, id) => {
        if (error) {
          return reject(error);
        }
        cartId = id;
        resolve();
      });
    });

    // Create a new cart if customer doesn't have one

    if (!cartId) {
      const createCart = (callback) => {
        db.query('INSERT INTO Cart (customer_id, cart_name) VALUES (?, ?)', [customerId, 'My Cart'], (err, result) => {
          if (err) {
            return callback(err);
          }
          callback(null, result.cart_id);
        });
      };

      await new Promise((resolve, reject) => {
        createCart((error, id) => {
          if (error) {
            return reject(error);
          }
          cartId = id;
          resolve();
        });
      });
    }
  // from above we have cartId now. so now we will just return the cart items from this api
  
    db.query('select * from  cart_items where cart_id = ?', [cartId], (err,results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
})

app.post('/removefromcart',async (req, res)=>{
  console.log("request coming for removal  ")
  const token = req.headers['auth-token'];
  if (!token) return res.status(401).send({ message: 'Unauthorized: Missing auth token' });

  try {
    const decoded = jwt.verify(token, "mysupersecretpassword"); // Replace with your secret
    const customerId = decoded.id;
    const findCartId = (callback) => {
      db.query('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId], (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(null, rows.length === 0 ? null : rows[0].cart_id);
      });
    };
    let cartId;
    await new Promise((resolve, reject) => {
      findCartId((error, id) => {
        if (error) {
          return reject(error);
        }
        cartId = id;
        resolve();
      });
    });
    const { itemId } = req.body;
    if (!itemId) return res.status(400).send({ message: 'Missing item ID in request body' });

    const checkQuanatity = (callback) => {
      db.query('SELECT quantity FROM cart_items WHERE cart_id = ?', [cartId], (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(null, rows.length === 0 ? null : rows[0].quantity);
      });
    };
    let quantity;
    await new Promise((resolve, reject) => {
      checkQuanatity((error, count) => {
        if (error) {
          return reject(error);
        }
        quantity = count;
        resolve();
      });
    });

console.log(quantity);
if(quantity==1){
    db.query('delete from  cart_items where product_id = ? and cart_id = ?', [itemId , cartId], (err,results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
      }
      res.status(200).json(results);
    });}
    else
    {
      db.query('update cart_items set quantity = quantity-1 where product_id = ? and cart_id = ?', [itemId , cartId], (err,results) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Internal server error' });
        }
        res.status(200).json(results);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
})

app.get('/api/reviews/:productId', async (req, res) => { // Use dynamic route parameter
  try {
    console.log(req.params.productId);

    const result =  db.query('SELECT review, rating FROM reviews WHERE product_id = ?', [req.params.productId],(err,result)=>{
      
      console.log("no review",result);
      return res.status(200).json(result); 
    }); // Use route parameter
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching reviews');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
