const authorModel = require('../Models/authorModel');
const validator = require('email-validator');
const jwt = require("jsonwebtoken");

// =======================[Validations]======================================
const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) {
    // console.log("1")
    return false
  }

  if (typeof value == 'string' && value.trim().length == 0) {
    // console.log("2")  
    return false
  }
  if (typeof value == 'string' && value.length !== value.trim().length) {
    // console.log("3")
    return false
  }
  if (typeof value == 'number') {
    // console.log("4")
    return false
  }
  return true
}
// =======================[ Title Validation]======================================
const isValidTitle = function (title) {
  return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

// =======================[Create Authors]======================================

const createAuthor = async function (req, res) {
  try {
    let data = req.body
    const { fname, lname, title, email, password } = data;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Body should  be not Empty" })
    }
    let inValid = ' '
    if (!isValid(fname)) inValid = inValid + "fname "
    if (!isValid(lname)) inValid = inValid + 'lname '
    if (!isValid(title)) inValid = inValid + "title "
    if (!isValid(email)) inValid = inValid + "email "
    if (!isValid(password)) inValid = inValid + "password "
    if (!isValid(fname) || !isValid(lname) || !isValid(title) || !isValid(email) || !isValid(password)) {
      return res.status(400).send({ status: false, message: `Enter the following field(s): ${inValid}` })
    }
    if (!isValidTitle(title))
      return res.status(400).send({ status: false, message: "Title can attain the value either 'Mr' ,'Mrs' or 'Miss'" })

    const validEmail = validator.validate(email)
    if (validEmail == false) {
      return res.status(400).send({ status: false, message: "Email is not valid" })
    }
    let validemail = await authorModel.find({ email: email })
    if (validemail.length == 0) {
      let savedData = await authorModel.create(data)
      res.status(201).send({ status: true, data: savedData })
    }
    else { res.status(400).send({ status: false, message: "This Email is already in use" }) }
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

module.exports.createAuthor = createAuthor

// ===========================[Login]========================================

const loginAuthor = async function (req, res) {
  try {
    let emailId = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({ email: emailId, password: password });
    if (!author) {
      return res.status(400).send({
      status: false, message: "email or password is not correct"
      })
    }

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organisation: "FunctionUp"
      },
      "aishwarya-anugya-anjali-kimmi"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, token: token });

  }
  catch (err) {
    res.status(500).send({ status: false, message: "Error", error: err.message })
  }
}

module.exports.loginAuthor = loginAuthor