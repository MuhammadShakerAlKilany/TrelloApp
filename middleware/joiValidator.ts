import tryCatchErr from "./tryCatchErr";

export function joiValidatorBody(schema: any) {
  return tryCatchErr<any, any, any, any>(async (req, res, next) => {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  });
}
export function joiValidatorParams(schema: any) {
  return tryCatchErr<any, any, any, any>(async (req, res, next) => {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  });
}
