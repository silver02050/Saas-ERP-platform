// const mongoose = require("mongoose");
// const ADMIN = require("./admin"); // Assuming adminSchema.js is in the same directory
// const STAFF = require("./staffs"); // Assuming staffSchema.js is in the same directory

// let BRANCH;

// if (mongoose.models.BRANCH) {
//   BRANCH = mongoose.model("BRANCH");
// } else {
//   const BranchSchema = new mongoose.Schema({
//     _id: {
//       type: mongoose.Schema.Types.ObjectId,
//       auto: true, // Let MongoDB generate the _id automatically
//     },
//     id: {
//       type: String,
//       required: true,
//     },
//     cityName: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     companyName: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     countryName: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     branchEmail: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     stateName: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     streetName: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     websiteUrl: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     manager: {
//       type: String,
//       required: true,
//       unique: false,
//     },
//     keys: [
//       {
//         name: {
//           type: String,
//           required: true,
//         },
//         description: String,
//         createdTime: {
//           type: Date,
//           default: Date.now,
//         },
//         key: {
//           type: String,
//           unique: true,
//           required: true,
//         },
//       },
//     ],
//     childBranch: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: BRANCH, // Reference to the Branch model
//         default: NaN,
//       },
//     ],
//   });

//   BRANCH = mongoose.model("BRANCH", BranchSchema);
// }

// module.exports = BRANCH;


const mongoose = require("mongoose");

// Define the BranchSchema
const BranchSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Let MongoDB generate the _id automatically
    },
    id: {
        type: String,
        required: true,
    },
    cityName: {
        type: String,
        required: true,
        unique: false,
    },
    companyName: {
        type: String,
        required: true,
        unique: false,
    },
    countryName: {
        type: String,
        required: true,
        unique: false,
    },
    branchEmail: {
        type: String,
        required: true,
        unique: false,
    },
    phone: {
        type: String,
        required: true,
        unique: false,
    },
    stateName: {
        type: String,
        required: true,
        unique: false,
    },
    streetName: {
        type: String,
        required: true,
        unique: false,
    },
    websiteUrl: {
        type: String,
        required: true,
        unique: false,
    },
    manager: {
        type: String,
        required: true,
        unique: false,
    },
    keys: [
        {
            name: {
                type: String,
                required: true,
            },
            description: String,
            createdTime: {
                type: Date,
                default: Date.now,
            },
            key: {
                type: String,
                required: true,
            },
        },
    ],
    childBranch: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BRANCH", // Reference to the Branch model
            default: NaN,
        },
    ],
});

// Create the BRANCH model
const BRANCH = mongoose.models.BRANCH || mongoose.model("BRANCH", BranchSchema);

module.exports = BRANCH;

