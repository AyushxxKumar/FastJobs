# FastJobs
This a project to parse and store excel file to mongoDB database
Command Line scripting includes:
mkdir FastJobs
cd FastJobs
npm init -y
npm install -g express-generator
npx express --view=ejs
npm install mongoose multer body-parser 
npm install convert-excel-to-json
npm install body-parser

Now,
1)Create  petsModel.js file.
2)Created a form with a `file input` tag element that allows me to choose Excel file and a button to submit the form.
3)Import body-parser, express, mongoose,convert-excel-to-json, multer dependencies in app.js
4)Defined schema in petsModel.js file

Rest all explanations commented in the code itself.
