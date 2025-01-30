import express from 'express';
import { addUnit, deleteUnit, getAllUnits, getAllUnitsSorted, getUnit, updateUnit } from './units.controller.js';
import { allowedExtensions } from '../../utilities/allowedExtensions.js';
import { multerCloudFunction } from '../../services/multerCloud.js';
import { addUnitEndpoints } from './unitsEndPoints.js';
import { isAuth } from "../../middleware/isAuth.js";


const unitRouter = express.Router();

unitRouter.get('/getallunits',getAllUnits )
unitRouter.get('/getallunitssorted',getAllUnitsSorted)
unitRouter.get('/getunit/:id',getUnit )
unitRouter.post('/addunit'/*,isAuth(addUnitEndpoints.ADD_UNIT)*/, multerCloudFunction(allowedExtensions.Image).array("images", 10),addUnit)
unitRouter.put('/updateunit/:id'/*,isAuth(addUnitEndpoints.ADD_UNIT)*/, multerCloudFunction(allowedExtensions.Image).array("images", 10),updateUnit)
unitRouter.delete('/deleteunit/:id'/*,isAuth(addUnitEndpoints.ADD_UNIT)*/,deleteUnit)


getAllUnitsSorted
export default unitRouter;