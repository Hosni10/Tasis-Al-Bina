import express from 'express';
import { addUnit, deleteUnit, getAllUnits, getUnit, updateUnit } from './units.controller.js';


const unitRouter = express.Router();

unitRouter.get('/getallunits',getAllUnits )
unitRouter.get('/getunit/:id',getUnit )
unitRouter.post('/addunit',addUnit)
unitRouter.delete('/deleteunit',deleteUnit)
unitRouter.put('/updateunit/:id',updateUnit)

export default unitRouter;