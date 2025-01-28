import express from 'express';
import { addReservation, deleteReservation, getReservationById, getReservations, updateReservation } from './reservations.controller.js';

const reservationRouter = express.Router();

reservationRouter.get('/getallres',getReservations);
reservationRouter.get('/getreservation/:id',getReservationById)
reservationRouter.put('/updatereservation/:id',updateReservation)
reservationRouter.delete('/deletereservation/:id',deleteReservation)
reservationRouter.post('/addreservation',addReservation)

export default reservationRouter;