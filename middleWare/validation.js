const {
    check,
    validationResult
} = require('express-validator');
var lodash = require('lodash');

//Admin
const admin_login_validators = [
    check('username').not().isEmpty().withMessage("Username is required"),
    check('password').not().isEmpty().withMessage("Password is required")
]


//Admin-Supervisor
const admin_supervisor_transfer_validators = [
    check('from').not().isEmpty().withMessage("Select 'from' is required").isNumeric().withMessage("'from' id should be numeric"),
    check('to').not().isEmpty().withMessage("Select 'to' is required").isNumeric().withMessage("'to' id should be numeric"),
]

const admin_supervisor_verification_validators = [
    check('sv_status').not().isEmpty().withMessage("Supervisor Status is required"),
    check('sv_id').not().isEmpty().withMessage("Supervisor ID is required").isNumeric().withMessage("Supervisor ID should be numeric"),
]

const admin_supervisor_delete_validators = [
    check('sv_id').not().isEmpty().withMessage("Supervisor ID is required").isNumeric().withMessage("Supervisor ID should be numeric"),
]


//Admin-Student
const admin_student_register_validators = [
    check('std_name').not().isEmpty().withMessage("Student name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('std_address').not().isEmpty().withMessage("Student address is required").isLength({
        min: 3,
        max: 200
    }).withMessage("Address character length should be in between 3 to 200"),
    check('std_gender').not().isEmpty().withMessage("Gender is required").isLength({
        min: 1,
        max: 1
    }).withMessage("Enter valid gender").isIn(['M', 'F']).withMessage("Enter valid gender"),
    check('std_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 10
    }).withMessage("Enter valid mobile number").isNumeric().withMessage("Mobile number should be numeric"),
    check('std_birthdate').not().isEmpty().withMessage("Student birthdate is required"),
    check('sv_id').not().isEmpty().withMessage("Supervisor ID is required").isNumeric().withMessage("Supervisor ID should be numeric"),
    check('inst_id').not().isEmpty().withMessage("Institute ID is required").isNumeric().withMessage("Institute ID should be numeric"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric"),
]

const admin_student_update_validators = [
    check('std_name').not().isEmpty().withMessage("Student name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('std_address').not().isEmpty().withMessage("Student address is required").isLength({
        min: 3,
        max: 200
    }).withMessage("Address character length should be in between 3 to 200"),
    check('std_gender').not().isEmpty().withMessage("Gender is required").isLength({
        min: 1,
        max: 1
    }).withMessage("Enter valid gender").isIn(['M', 'F']).withMessage("Enter valid gender"),
    check('std_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 10
    }).withMessage("Enter valid mobile number").isNumeric().withMessage("Mobile number should be numeric"),
    check('std_birthdate').not().isEmpty().withMessage("Student birthdate is required"),
    check('sv_id').not().isEmpty().withMessage("Supervisor ID is required").isNumeric().withMessage("Supervisor ID should be numeric"),
    check('inst_id').not().isEmpty().withMessage("Institute ID is required").isNumeric().withMessage("Institute ID should be numeric"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric"),
    check('std_id').not().isEmpty().withMessage("Student ID is required").isNumeric().withMessage("Student ID should be numeric"),
]

const admin_student_delete_validators = [
    check('std_id').not().isEmpty().withMessage("Student ID is required").isNumeric().withMessage("Student ID should be numeric"),
]


//Admin-Institutes
const admin_institute_register_validators = [
    check('inst_name').not().isEmpty().withMessage("Institute name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('inst_address').not().isEmpty().withMessage("Institute address is required").isLength({
        min: 3,
        max: 200
    }).withMessage("Address character length should be in between 3 to 200"),
    check('inst_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 12
    }).withMessage("Enter valid mobile number").matches(/(\d{10})|\d{5}([- ]*)\d{6}/).withMessage('Enter proper number')
]

const admin_institute_update_validators = [
    check('inst_name').not().isEmpty().withMessage("Institute name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('inst_address').not().isEmpty().withMessage("Institute address is required").isLength({
        min: 3,
        max: 200
    }).withMessage("Address character length should be in between 3 to 200"),
    check('inst_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 12
    }).withMessage("Enter valid mobile number").matches(/(\d{10})|\d{5}([- ]*)\d{6}/).withMessage('Enter proper number'),
    check('inst_id').not().isEmpty().withMessage("Institute ID is required").isNumeric().withMessage("Institute ID should be numeric"),
]

const admin_institute_delete_validators = [
    check('inst_id').not().isEmpty().withMessage("Institute ID is required").isNumeric().withMessage("Institute ID should be numeric"),
]


//Admin-Grades
const admin_grade_register_validators = [
    check('standard').not().isEmpty().withMessage("Standard is required")
]

const admin_grade_update_validators = [
    check('standard').not().isEmpty().withMessage("Standard is required"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric")
]

const admin_grade_delete_validators = [
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric")
]


//Admin-Categories
const admin_category_register_validators = [
    check('cat_name').not().isEmpty().withMessage("Category name is required")
]

const admin_category_update_validators = [
    check('cat_name').not().isEmpty().withMessage("Category name is required"),
    check('cat_id').not().isEmpty().withMessage("Category ID is required").isNumeric().withMessage("Category ID should be numeric")
]

const admin_category_delete_validators = [
    check('cat_id').not().isEmpty().withMessage("Category ID is required").isNumeric().withMessage("Category ID should be numeric")
]

//Admin-Books
const admin_books_upload_validators = [
    check('book_name').not().isEmpty().withMessage("Book name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('book_author').not().isEmpty().withMessage("Book Author name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('cat_id').not().isEmpty().withMessage("Categories ID is required").isNumeric().withMessage("Categories ID should be numeric"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric"),
]

const admin_books_update_validators = [
    check('book_name').not().isEmpty().withMessage("Book name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('book_author').not().isEmpty().withMessage("Book Author name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('cat_id').not().isEmpty().withMessage("Categories ID is required").isNumeric().withMessage("Categories ID should be numeric"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric"),
]

const admin_books_delete_validators = [
    check('book_id').not().isEmpty().withMessage("Book ID is required").isNumeric().withMessage("Book ID should be numeric")
]

//Admin-Device
const admin_device_register_validators = [
    check('unique_id').not().isEmpty().withMessage("Unique ID is required").isLength({
        min: 15,
        max: 15
    }).withMessage("Unique ID should be of 15 digit"),
    check('sv_id').not().isEmpty().withMessage("Supervisor ID is required").isNumeric().withMessage("Supervisor ID should be numeric"),
]

const admin_device_update_validators = [
    check('unique_id').not().isEmpty().withMessage("Unique ID is required").isLength({
        min: 15,
        max: 15
    }).withMessage("Unique ID should be of 15 digit"),
    check('sv_id').not().isEmpty().withMessage("Supervisor ID is required").isNumeric().withMessage("Supervisor ID should be numeric"),
    check('device_id').not().isEmpty().withMessage("Device ID is required").isNumeric().withMessage("Device ID should be numeric")
]

//Supervisor
const supervisor_register_validators = [
    check('username').not().isEmpty().withMessage("Username is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('password').not().isEmpty().withMessage("Password is required").isLength({
        min: 6
    }).withMessage("Chatacter should be 6 or more"),
    check('sv_name').not().isEmpty().withMessage("Supervisor Name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('sv_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 10
    }).withMessage("Enter valid mobile number").isNumeric().withMessage("Mobile number should be numeric"),
    check('sv_email').not().isEmpty().withMessage("Email is required").normalizeEmail().isEmail().withMessage("Enter proper Email address"),
    check('sv_location').not().isEmpty().withMessage("Location is required"),
]

const supervisor_login_validators = [
    check('username').not().isEmpty().withMessage("Username is required"),
    check('password').not().isEmpty().withMessage("Password is required")
]

//Supervisor-Student
const supervisor_student_register_validators = [
    check('std_name').not().isEmpty().withMessage("Student name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('std_address').not().isEmpty().withMessage("Student address is required"),
    check('std_gender').not().isEmpty().withMessage("Gender is required").isLength({
        min: 1,
        max: 1
    }).withMessage("Enter valid gender").isIn(['M', 'F']).withMessage("Enter valid gender"),
    check('std_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 10
    }).withMessage("Enter valid mobile number").isNumeric().withMessage("Mobile number should be numeric"),
    check('std_birthdate').not().isEmpty().withMessage("Student birthdate is required"),
    check('inst_id').not().isEmpty().withMessage("Institute ID is required").isNumeric().withMessage("Institute ID should be numeric"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric"),
]

const supervisor_student_update_validators = [
    check('std_name').not().isEmpty().withMessage("Student name is required").isLength({
        min: 3
    }).withMessage("Chatacter should be 3 or more"),
    check('std_address').not().isEmpty().withMessage("Student address is required"),
    check('std_gender').not().isEmpty().withMessage("Gender is required").isLength({
        min: 1,
        max: 1
    }).withMessage("Enter valid gender").isIn(['M', 'F']).withMessage("Enter valid gender"),
    check('std_contact').not().isEmpty().withMessage("Mobile number is required").isLength({
        min: 10,
        max: 10
    }).withMessage("Enter valid mobile number").isNumeric().withMessage("Mobile number should be numeric"),
    check('std_birthdate').not().isEmpty().withMessage("Student birthdate is required"),
    check('inst_id').not().isEmpty().withMessage("Institute ID is required").isNumeric().withMessage("Institute ID should be numeric"),
    check('grade_id').not().isEmpty().withMessage("Grade ID is required").isNumeric().withMessage("Grade ID should be numeric"),
    check('std_id').not().isEmpty().withMessage("Student ID is required").isNumeric().withMessage("Student ID should be numeric"),
]

const supervisor_student_delete_validators = [
    check('std_id').not().isEmpty().withMessage("Student ID is required").isNumeric().withMessage("Student ID should be numeric"),
]

//Supervisor-Device
const supervisor_assignDevice_validators = [
    check('device_id').not().isEmpty().withMessage("Device ID is required").isNumeric().withMessage("Device ID should be numeric"),
    check('std_id').not().isEmpty().withMessage("Student ID is required").isNumeric().withMessage("Student ID should be numeric"),
]

const supervisor_unAssignDdevice_validators = [
    check('device_id').not().isEmpty().withMessage("Device ID is required").isNumeric().withMessage("Device ID should be numeric"),
    check('std_id').not().isEmpty().withMessage("Student ID is required").isNumeric().withMessage("Student ID should be numeric"),
]



//Student
const student_login_validators = [
    check('username').not().isEmpty().withMessage("Username is required"),
    check('password').not().isEmpty().withMessage("Password is required"),
    check('unique_id').not().isEmpty().withMessage("Unique ID is required")
]


//This function will make an array of error messages
var validation = (req, res, next) => {
    const errors = validationResult(req);
    const ap = errors.array();
    // console.log(ap);
    if (!errors.isEmpty()) {
        const err = lodash.map(errors.mapped(), 'msg');
        console.log(err);
        res.status(400).send({
            success: false,
            msg: err,
            validate: true
        });
    } else {
        next();
    }
};

module.exports = {
    validation: validation,

    //All admin validation
    admin_login_validators: admin_login_validators,

    //Admin-Supervisor
    admin_supervisor_transfer_validators: admin_supervisor_transfer_validators,
    admin_supervisor_verification_validators: admin_supervisor_verification_validators,
    admin_supervisor_delete_validators: admin_supervisor_delete_validators,

    //Admin-Student
    admin_student_register_validators: admin_student_register_validators,
    admin_student_update_validators: admin_student_update_validators,
    admin_student_delete_validators: admin_student_delete_validators,

    //Admin-Institute
    admin_institute_register_validators: admin_institute_register_validators,
    admin_institute_update_validators: admin_institute_update_validators,
    admin_institute_delete_validators: admin_institute_delete_validators,

    //Admin-Grades
    admin_grade_register_validators: admin_grade_register_validators,
    admin_grade_update_validators: admin_grade_update_validators,
    admin_grade_delete_validators: admin_grade_delete_validators,

    //Admin-Categories
    admin_category_register_validators: admin_category_register_validators,
    admin_category_update_validators: admin_category_update_validators,
    admin_category_delete_validators: admin_category_delete_validators,

    //Admin-Books
    admin_books_upload_validators: admin_books_upload_validators,
    admin_books_update_validators: admin_books_update_validators,
    admin_books_delete_validators: admin_books_delete_validators,

    //Admin-Device
    admin_device_register_validators: admin_device_register_validators,
    admin_device_update_validators: admin_device_update_validators,

    //All supervisor validation
    supervisor_register_validators: supervisor_register_validators,
    supervisor_login_validators: supervisor_login_validators,

    //Supervisor-Student
    supervisor_student_register_validators: supervisor_student_register_validators,
    supervisor_student_update_validators: supervisor_student_update_validators,
    supervisor_student_delete_validators: supervisor_student_delete_validators,

    //Supervisor-Device
    supervisor_assignDevice_validators: supervisor_assignDevice_validators,
    supervisor_unAssignDdevice_validators: supervisor_unAssignDdevice_validators,

    //All Student validation
    student_login_validators: student_login_validators,
}