import express from 'express';
import { addUnit, deleteUnit, getAllUnits, getAllUnitsSorted, getUnit, getUnitWithCategory, updateUnit,getAllUnitByCategoryId } from './units.controller.js';
import { allowedExtensions } from '../../utilities/allowedExtensions.js';
import { multerCloudFunction } from '../../services/multerCloud.js';
// import { addUnitEndpoints } from './unitsEndPoints.js';
// import { isAuth } from "../../middleware/isAuth.js";


const unitRouter = express.Router();

unitRouter.get('/getallunits',getAllUnits )
unitRouter.get('/getallunitssorted',getAllUnitsSorted)
unitRouter.get('/getunit/:id',getUnit )
unitRouter.post('/addunit'/*,isAuth(addUnitEndpoints.ADD_UNIT)*/, multerCloudFunction(allowedExtensions.Image).array("images", 10),addUnit)
unitRouter.put('/updateunit/:id'/*,isAuth(addUnitEndpoints.ADD_UNIT)*/, multerCloudFunction(allowedExtensions.Image).array("images", 10),updateUnit)
unitRouter.delete('/deleteunit/:id'/*,isAuth(addUnitEndpoints.ADD_UNIT)*/,deleteUnit)



// get all unit with the full category data
unitRouter.get('/getUnitWithCategory',getUnitWithCategory)


// get all unit with the full category data
unitRouter.get('/getAllUnitByCategoryId',getAllUnitByCategoryId)

export default unitRouter;