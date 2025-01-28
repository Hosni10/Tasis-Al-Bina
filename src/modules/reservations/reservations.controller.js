import express from "express";
import { Reservation } from "../../../database/models/reservation.model";
import { Unit } from "../../../database/models/unit.model";

const addReservation = async (req, res) => {
  const { customerName, customerEmail, customerPhone, date, unitId } = req.bod;
  const unit = await Unit.findById(unitId);
  if (!unit) return res.status(404).json({ msg: "Unit not found" });
  const newReservation = new Reservation({
    customerName,
    customerEmail,
    customerPhone,
    date,
    unit,
  });
  const savedReservation = await newReservation.save();
  res.status(201).json(savedReservation);
};

const updateReservation = async (req, res) => {
  const { reservationId, customerName, customerEmail, customerPhone, date } =
    req.body;
  const updatedReservation = await Reservation.findByIdAndUpdate(
    reservationId,
    { customerName, customerEmail, customerPhone, date },
    { new: true }
  );
  if (!updatedReservation)
    return res.status(404).json({ msg: "Reservation not found" });
  res.json(updatedReservation);
};

const deleteReservation = async (req, res) => {
  const { reservationId } = req.params;
  const deletedReservation = await Reservation.findByIdAndDelete(reservationId);
  if (!deletedReservation)
    return res.status(404).json({ msg: "Reservation not found" });
  res.json({ msg: "Reservation deleted successfully" });
};

const getReservations = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const query = {};
  if (search) {
    query.$or = {
      customerName: { $regex: search, $options: "i" },
      customerEmail: { $regex: search, $options: "i" },
      customerPhone: { $regex: search, $options: "i" },
    };
  }
  const skip = (page - 1) * limit;
  const total = await Reservation.countDocuments(query);
  const reservations = await Reservation.find()
    .populate("unitId")
    .skip(skip)
    .limit(limit);
  res.json({
    totalPages: Math.ceil(total / limit),
    reservations,
  });
};

const getReservationById = async (req, res) => {
  const { reservationId } = req.params;
  const reservation = await Reservation.findById(reservationId).populate(
    "unitId"
  );
  if (!reservation)
    return res.status(404).json({ msg: "Reservation not found" });
  res.json(reservation);
};

export {
  addReservation,
  updateReservation,
  deleteReservation,
  getReservations,
  getReservationById,
};
