const bcrypt=require("bcryptjs"),{v4:uuidv4}=require("uuid"),db=require("./utils/db");
async function seed(){
  console.log("Seeding RoomieFind_Vineela...");
  const h=await bcrypt.hash("password123",10);
  db.writeAll("users",[
    {id:"u1",name:"Vineela Pottabathini",email:"vineela@example.com",passwordHash:h,phone:"9876543210",role:"owner",isVerified:true,bio:"Platform creator & property owner",avatar:"",createdAt:new Date().toISOString()},
    {id:"u2",name:"Raj Kumar",email:"raj@example.com",passwordHash:h,phone:"9876543211",role:"owner",isVerified:true,bio:"Managing 3 properties in Hyderabad",avatar:"",createdAt:new Date().toISOString()},
    {id:"u3",name:"Arjun Mehta",email:"arjun@example.com",passwordHash:h,phone:"9876543212",role:"tenant",isVerified:true,bio:"IT engineer near Hitech City",avatar:"",createdAt:new Date().toISOString()},
    {id:"u4",name:"Sana Shaikh",email:"sana@example.com",passwordHash:h,phone:"9876543213",role:"tenant",isVerified:false,bio:"MBA student at ISB",avatar:"",createdAt:new Date().toISOString()},
    {id:"u5",name:"Vikram Nair",email:"vikram@example.com",passwordHash:h,phone:"9876543214",role:"tenant",isVerified:true,bio:"Early riser, non-smoker, gym freak",avatar:"",createdAt:new Date().toISOString()},
    {id:"u6",name:"Priya Reddy",email:"priya@example.com",passwordHash:h,phone:"9876543215",role:"tenant",isVerified:true,bio:"Software developer, loves cooking",avatar:"",createdAt:new Date().toISOString()},
  ]);
  db.writeAll("listings",[
    {id:"l1",ownerId:"u1",title:"Luxury 2BHK in Banjara Hills",description:"Fully furnished premium apartment with modular kitchen, high-speed WiFi and 24/7 security. Walking distance to major malls and restaurants. Ideal for young professionals.",propertyType:"flat",rent:25000,deposit:75000,bedrooms:2,bathrooms:2,area:"Banjara Hills",city:"Hyderabad",pincode:"500034",amenities:["wifi","ac","parking","gym","power_backup","cctv"],photos:["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=80"],availableFrom:"2024-02-01T00:00:00.000Z",isAvailable:true,createdAt:new Date(Date.now()-5*86400000).toISOString()},
    {id:"l2",ownerId:"u2",title:"Modern 1BHK near Hitech City Metro",description:"Smart home with automated lights, fully furnished with premium furniture. 2 min walk to Metro. No brokerage. Owner verified.",propertyType:"flat",rent:15000,deposit:30000,bedrooms:1,bathrooms:1,area:"Hitech City",city:"Hyderabad",pincode:"500081",amenities:["wifi","ac","power_backup","washing_machine"],photos:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80"],availableFrom:"2024-01-15T00:00:00.000Z",isAvailable:true,createdAt:new Date(Date.now()-3*86400000).toISOString()},
    {id:"l3",ownerId:"u1",title:"Premium PG for Girls – Jubilee Hills",description:"Safe, secure and beautiful PG exclusively for working women and students. Home-cooked meals, CCTV, biometric entry, laundry service included.",propertyType:"pg",rent:9000,deposit:18000,bedrooms:1,bathrooms:1,area:"Jubilee Hills",city:"Hyderabad",pincode:"500033",amenities:["wifi","meals","laundry","cctv","ac"],photos:["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=80"],availableFrom:"2024-01-20T00:00:00.000Z",isAvailable:true,createdAt:new Date(Date.now()-2*86400000).toISOString()},
    {id:"l4",ownerId:"u2",title:"Spacious 3BHK Villa – Gachibowli",description:"Independent villa with terrace, garden, servant quarters and 2-car parking. Minutes from DLF Cybercity and top international schools. Fully furnished.",propertyType:"house",rent:42000,deposit:126000,bedrooms:3,bathrooms:3,area:"Gachibowli",city:"Hyderabad",pincode:"500032",amenities:["parking","garden","power_backup","cctv","ac","gym"],photos:["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80","https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80"],availableFrom:"2024-02-10T00:00:00.000Z",isAvailable:true,createdAt:new Date(Date.now()-1*86400000).toISOString()},
    {id:"l5",ownerId:"u1",title:"Private Room in Shared Flat – Madhapur",description:"Furnished private room in a 3BHK flat shared with 2 IT professionals. Attached bathroom, AC, wardrobe. Split utilities. No brokerage.",propertyType:"room",rent:8000,deposit:16000,bedrooms:1,bathrooms:1,area:"Madhapur",city:"Hyderabad",pincode:"500081",amenities:["wifi","ac","washing_machine"],photos:["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=700&q=80"],availableFrom:"2024-01-25T00:00:00.000Z",isAvailable:true,createdAt:new Date().toISOString()},
    {id:"l6",ownerId:"u2",title:"Co-living Space – Kondapur",description:"Premium co-living with community events, shared workspaces, high-speed internet and chef-prepared meals. All-inclusive pricing. Perfect for remote workers.",propertyType:"pg",rent:12000,deposit:24000,bedrooms:1,bathrooms:1,area:"Kondapur",city:"Hyderabad",pincode:"500084",amenities:["wifi","meals","gym","laundry","ac","power_backup"],photos:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80"],availableFrom:"2024-02-05T00:00:00.000Z",isAvailable:true,createdAt:new Date(Date.now()-4*86400000).toISOString()},
  ]);
  db.writeAll("roommateProfiles",[
    {id:"rp3",userId:"u3",budgetMin:6000,budgetMax:10000,preferredArea:"Hitech City",genderPref:"male",gender:"male",smoking:false,sleepSchedule:"early",cleanliness:4,workSchedule:"9-5 office",bio:"IT professional, tidy, non-smoker.",createdAt:new Date().toISOString()},
    {id:"rp4",userId:"u4",budgetMin:7000,budgetMax:9000,preferredArea:"Jubilee Hills",genderPref:"female",gender:"female",smoking:false,sleepSchedule:"flexible",cleanliness:5,workSchedule:"student",bio:"MBA student, need quiet environment.",createdAt:new Date().toISOString()},
    {id:"rp5",userId:"u5",budgetMin:6000,budgetMax:11000,preferredArea:"Hitech City",genderPref:"male",gender:"male",smoking:false,sleepSchedule:"early",cleanliness:4,workSchedule:"9-5 office",bio:"Gym enthusiast, very organized.",createdAt:new Date().toISOString()},
    {id:"rp6",userId:"u6",budgetMin:8000,budgetMax:13000,preferredArea:"Banjara Hills",genderPref:"female",gender:"female",smoking:false,sleepSchedule:"flexible",cleanliness:4,workSchedule:"remote",bio:"WFH software developer, loves cooking.",createdAt:new Date().toISOString()},
  ]);
  db.writeAll("reviews",[
    {id:"rv1",reviewerId:"u3",targetId:"l2",targetType:"listing",rating:5,comment:"Amazing location and super responsive owner. Highly recommend!",createdAt:new Date().toISOString()},
    {id:"rv2",reviewerId:"u4",targetId:"l3",targetType:"listing",rating:4,comment:"Very safe and clean. The meals are great!",createdAt:new Date().toISOString()},
    {id:"rv3",reviewerId:"u5",targetId:"l1",targetType:"listing",rating:5,comment:"Premium quality at a fair price. Love the amenities.",createdAt:new Date().toISOString()},
  ]);
  db.writeAll("messages",[]);
  db.writeAll("connections",[]);
  console.log("\nSeeded successfully!\nDemo accounts (password: password123):");
  console.log("  Owner:  vineela@example.com | raj@example.com");
  console.log("  Tenant: arjun@example.com | sana@example.com | vikram@example.com | priya@example.com");
}
seed().catch(console.error);
