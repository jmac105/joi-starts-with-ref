const Joi = require("joi");
const hoek = require("hoek");

const customJoi = Joi.extend(joi => ({
  "base": joi.string(),
  "name": "string",
  "language": {
    "startsWithRef": "needs to start with value of '{{n}}' : {{v}}"
  },
  "rules": [
    {
      "name": "startsWithRef",
      "params": {
        "refKey": joi.string()
      },
      validate(params, value, state, options) {
        const expected = hoek.reach(state.parent, joi.ref(params.refKey).key);
        return value.startsWith(expected)
          ? value
          : this.createError(
            "string.startsWithRef",
            {"v": expected, "n": params.refKey},
            state,
            options
          );
      }
    }
  ]
}));

module.exports = customJoi;
