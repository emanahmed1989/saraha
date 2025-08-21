import { model, Schema } from "mongoose";
const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: function () {
            if (this.phoneNumber) { return false; }
            return true;
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent == 'google') { return false; }
            return true;
        }
    },
    phoneNumber: {
        type: String,
        required: function () {
            if (this.email) { return false; }
            return true;
        }
    },
    dob: {
        type: Date
    },
    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
    failedAttempts: {
        type: Number,
        default:0
    },
    failedAttemptsExpire: {
        type: Date
    },
    changepasswordAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userAgent: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    profilePic: {
        type: String
    },
    cloudprofilePic: {
        public_id: String,
        secure_url: String
    }

}, {
    timestamps: true,
    toObject: { virtuals: true },// to make virtual properties apear in object
    toJSON: { virtuals: true }// to make virtual properties apear in json
});
schema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
});
schema.virtual('fullName').set(function (value) {
    const [fName, lName] = value.split(' ');
    this.firstName = fName;
    this.lastName = lName;
});
schema.virtual('age').get(function () {
    return new Date().getFullYear() - new Date(this.dob).getFullYear();
})
export const User = model('user', schema);