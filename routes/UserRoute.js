const express = require('express');
const passport = require('passport');
const swaggerui = require('swagger-ui-express');
const swaggerdocument = require('../swagger.json')
const { RegisterUser, LoginUser ,UpdateProfile, GetUser, UpdatePassword, LogoutUser} = require('../controllers/UserController');
const {isAuthenticated} = require('../auth/UserAuth');
const {ForgetPassword, ResetPassworrd} = require('../repository/sendmail');
const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', passport.authenticate('local'), LoginUser);
router.put('/update', isAuthenticated, UpdateProfile);
// router.post('/isAuthenticated', isAuthenticated);
router.put('/updatepassword',isAuthenticated, UpdatePassword);
router.get('/user/:email',isAuthenticated, GetUser);
router.post('/forget', ForgetPassword);
router.post('/reset', ResetPassworrd);
router.get('/logout' , LogoutUser);

router.use('/api-docs', swaggerui.serve);
router.get('/api-docs', swaggerui.setup(swaggerdocument));

module.exports = router;