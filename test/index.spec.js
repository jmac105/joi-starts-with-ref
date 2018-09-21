const customStartsWithRef = require("../index");
const Lab = require("lab");
const Code = require("code");
const Joi = require("joi");

const {expect, fail} = Code;
const lab = exports.lab = Lab.script();
const {describe, it} = lab;

describe("The custom 'startsWithRef' joi rule", () => {
  const validTestObj = {
    "id": "something",
    "shouldStartWithId": "something else"
  };

  const invalidTestObj = {
    "id": "something",
    "shouldStartWithId": "this does not start with value of id"
  };

  const testSchema = Joi.object().keys({
    "id": Joi.string().required(),
    "shouldStartWithId": customStartsWithRef.string().startsWithRef("id").required()
  });

  it("should work when tested object is valid - using validate", () => {
    const result = Joi.validate(validTestObj, testSchema);

    expect(result.error).to.be.null();
  });

  it("should work when tested object is valid - using validate with callback", () => {
    return new Promise((resolve, reject) => {
      Joi.validate(validTestObj, testSchema, (err, result) => {
        try {
          expect(err).to.be.null();
          expect(result).to.equal(validTestObj);
          return resolve();
        } catch (error) {
          return reject(error);
        }
      });
    });
  });

  it("should work when tested object is valid - using assert", () => {
    // throws on error
    expect(() => Joi.assert(validTestObj, testSchema)).to.not.throw();
  });

  it("should provide proper error when tested object is not valid - using validate", () => {
    const result = Joi.validate(invalidTestObj, testSchema);

    expect(result.error).to.be.an.error();
    expect(result.error.name).to.equal("ValidationError");
    expect(result.error.details[0].message)
      .to.equal('"shouldStartWithId" needs to start with value of \'id\' : something'); // eslint-disable-line quotes
    expect(result.error.details[0].path).to.equal(["shouldStartWithId"]);
  });

  it("should provide proper error when tested object is not valid - using validate with callback", () => {
    return new Promise((resolve, reject) => {
      Joi.validate(invalidTestObj, testSchema, (err, result) => {
        try {
          expect(result).to.equal(invalidTestObj);
          expect(err).to.be.an.error();
          expect(err.name).to.equal("ValidationError");
          expect(err.details[0].message)
            .to.equal("\"shouldStartWithId\" needs to start with value of \'id\' : something");
          expect(err.details[0].path).to.equal(["shouldStartWithId"]);
          return resolve();
        } catch (error) {
          return reject(error);
        }
      });
    });
  });

  it("should provide proper error when tested object is not valid - using assert", () => {
    try {
      Joi.assert(invalidTestObj, testSchema);
    } catch (error) {
      expect(error).to.be.an.error();
      expect(error.name).to.equal("ValidationError");
      expect(error.details[0].message)
        .to.equal('"shouldStartWithId" needs to start with value of \'id\' : something'); // eslint-disable-line quotes
      expect(error.details[0].path).to.equal(["shouldStartWithId"]);
      return;
    }
    fail("Assert did not throw error");
  });
});
