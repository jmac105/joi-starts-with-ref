# joi-starts-with-ref
Joi custom validator to allow validating a field by checking it starts with the value of another field.

## Install
`npm i joi-starts-with-ref -S`

## Usage

See [the tests](test/index.spec.js) for more examples

```
const Joi = require("joi");
const joiStartsWith = require("joi-starts-with-ref");

module.exports = Joi.object().keys({
  "firstName": Joi.string(),
  "fullName": joiStartsWith.string().startsWithRef("firstName").required()
});
```
