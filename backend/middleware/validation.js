import Joi from "joi";
import { services } from "../../frontend/src/data/services.js";
// Reject markup and control characters rather than silently changing a user's request.
const text = (max, min = 1) =>
  Joi.string()
    .trim()
    .min(min)
    .max(max)
    .pattern(/^[^<>\u0000-\u0008\u000B\u000C\u000E-\u001F]*$/u);
const optional = text(1000, 0).allow("").optional();
const common = {
  consent: Joi.boolean().valid(true).required(),
  consentVersion: text(100).required(),
  website: Joi.string().max(0).allow("").optional(),
};
export const leadSchema = Joi.object({
  firstName: text(80).required(),
  lastName: text(80).required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .max(254)
    .required(),
  phone: Joi.string()
    .trim()
    .max(25)
    .custom((value, helpers) => {
      const digits = value.replace(/[\s()+.\-]/g, "");
      if (!/^1?[2-9]\d{2}[2-9]\d{6}$/.test(digits))
        return helpers.error("any.invalid");
      return "+1" + digits.replace(/^1/, "");
    })
    .required(),
  zip: Joi.string()
    .pattern(/^\d{5}$/)
    .required(),
  service: Joi.string()
    .valid(...services.map((s) => s.slug))
    .required(),
  projectDetails: text(2000, 10).required(),
  projectTimeline: Joi.string()
    .valid(
      "As soon as possible",
      "Within 30 days",
      "1–3 months",
      "Just researching",
    )
    .required(),
  homeownerStatus: Joi.string()
    .valid(
      "Homeowner",
      "Authorized property manager",
      "Tenant with owner permission",
      "Other",
    )
    .required(),
  ...common,
  // Record the submitted state without inventing consent when no disclosure is configured.
  consent: Joi.boolean().strict().required(),
  consentVersion: text(100, 0).allow("").default(""),
  landingPage: optional,
  referrer: optional,
  utmSource: text(500, 0).allow(""),
  utmMedium: text(500, 0).allow(""),
  utmCampaign: text(500, 0).allow(""),
  utmContent: text(500, 0).allow(""),
  utmTerm: text(500, 0).allow(""),
  gclid: text(500, 0).allow(""),
  fbclid: text(500, 0).allow(""),
  msclkid: text(500, 0).allow(""),
}).unknown(false);
export const inquirySchema = Joi.object({
  name: text(160).required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .max(254)
    .required(),
  inquiryType: Joi.string()
    .valid(
      "General question",
      "Service question",
      "Project question",
      "Existing request",
      "Website support",
      "Project request support",
      "Privacy inquiry",
    )
    .required(),
  message: text(3000, 10).required(),
  ...common,
  consent: Joi.boolean().strict().default(false),
  consentVersion: text(100, 0).allow("").default(""),
  phone: leadSchema.extract("phone").optional().allow(""),
  landingPage: optional,
  referrer: optional,
})
  .rename("topic", "inquiryType")
  .unknown(false);
export function validate(schema) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    if (error)
      return res.status(400).json({
        success: false,
        message: "Please check the request details and try again.",
        error: {
          code: "VALIDATION_ERROR",
          fields: [...new Set(error.details.map((d) => d.path[0]))],
        },
      });
    req.validated = value;
    next();
  };
}
