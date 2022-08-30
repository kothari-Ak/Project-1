const authorModel = require('../Models/authorModel');
const validator = require('email-validator');
const jwt = require("jsonwebtoken");

// =======================[Validations]======================================
const isValid = function (value) {
  if (typeof (value) == "undefined" || typeof (value) == null) {
    return false
  }

  if (typeof (value) == "string" && (value).trim().length == 0) {
    return false
  }

  if (typeof (value) === 'number') {
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
      return res.status(400).send({ status: false, message: "You must enter data." })
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
      return res.status(400).send({ status: false, message: "Enter a valid email ." })
    }
    let validemail = await authorModel.find({ email: email })
    if (validemail.length == 0) {
      let savedData = await authorModel.create(data)
      res.status(201).send({ status: true, data: savedData })
    }
    else { res.status(400).send({ status: false, message: "This Email is already in use ." }) }
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

    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({ status: false, message: "Must enter email and password ." })
    }

    let author = await authorModel.findOne({ email: emailId, password: password });
    if (!author) {
      return res.status(401).send({
        status: false, message: "email or the password is incorrect ."
      })
    }

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organisation: "FunctionUp"
      },
      "aishwarya-sejgaya"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });

  }
  catch (err) {
    res.status(500).send({ status: false, message: "Error", error: err.message })
  }
}

module.exports.loginAuthor = loginAuthor