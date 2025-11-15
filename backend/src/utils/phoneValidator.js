import {isValidPhoneNumber, parsePhoneNumber} from "libphonenumber-js";

export function validatePhoneNumberGoogle(phoneNumber) {
    try {
        if (!phoneNumber) {
            return { isValid: false, error: "Phone number is required" };
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            return { isValid: false, error: "Invalid phone number format" };
        }

        const parsed = parsePhoneNumber(phoneNumber);

        return {
            isValid: true,
            e164: parsed.format("E.164"),
            country: parsed.country,
            type: parsed.getType(),
            formatted: parsed.formatInternational()
        };

    } catch (err) {
        return {
            isValid: false,
            error: err.message || "Invalid phone number"
        };
    }
}
