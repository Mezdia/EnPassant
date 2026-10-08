'use client';
import { filterErrors } from '../hooks/use-form-errors/filter-errors/filter-errors.mjs';
import { getPath } from '../paths/get-path.mjs';
import 'klona/full';

const formRootRule = Symbol("root-rule");
function getValidationResults(errors) {
  const filteredErrors = filterErrors(errors);
  return { hasErrors: Object.keys(filteredErrors).length > 0, errors: filteredErrors };
}
function validateRulesRecord(rules, values, path = "", errors = {}) {
  if (typeof rules !== "object" || rules === null) {
    return errors;
  }
  return Object.keys(rules).reduce((acc, ruleKey) => {
    const rule = rules[ruleKey];
    const rulePath = `${path === "" ? "" : `${path}.`}${ruleKey}`;
    const value = getPath(rulePath, values);
    let arrayValidation = false;
    if (typeof rule === "function") {
      acc[rulePath] = rule(value, values, rulePath);
    }
    if (typeof rule === "object" && Array.isArray(value)) {
      arrayValidation = true;
      value.forEach(
        (_item, index) => validateRulesRecord(rule, values, `${rulePath}.${index}`, acc)
      );
      if (formRootRule in rule) {
        acc[rulePath] = rule[formRootRule](value, values, rulePath);
      }
    }
    if (typeof rule === "object" && typeof value === "object" && value !== null) {
      if (!arrayValidation) {
        validateRulesRecord(rule, values, rulePath, acc);
      }
      if (formRootRule in rule) {
        acc[rulePath] = rule[formRootRule](value, values, rulePath);
      }
    }
    return acc;
  }, errors);
}
function validateValues(validate, values) {
  if (typeof validate === "function") {
    return getValidationResults(validate(values));
  }
  return getValidationResults(validateRulesRecord(validate, values));
}

export { formRootRule, validateValues };
//# sourceMappingURL=validate-values.mjs.map
