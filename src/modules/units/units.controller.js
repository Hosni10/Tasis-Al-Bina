import mongoose from "mongoose";
import { Unit } from "../../../database/models/unit.model.js";

const addUnit = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      area,
      price,
      image,
      bedrooms,
      bathrooms,
      livingrooms,
      waterTank,
      floor,
      maidRoom,
      driverRoom,
      location,
    } = req.body;
    const newUnit = new Unit({
      title,
      type,
      description,
      area,
      price,
      image,
      bedrooms,
      bathrooms,
      livingrooms,
      waterTank,
      floor,
      maidRoom,
      driverRoom,
      location,
    });
    await newUnit.save();
    res.status(201).json({ message: "Unit Created Successfully", newUnit });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUnit = async (req, res) => {
  const unit = await Unit.findById(req.params.id);
  if (!unit) return res.status(404).json({ message: "Unit not found" });
  res.status(200).json({ message: "Success", unit });
};

const updateUnit = async (req, res) => {
  const {
    title,
    type,
    description,
    area,
    price,
    image,
    bedrooms,
    bathrooms,
    livingrooms,
    waterTank,
    floor,
    maidRoom,
    driverRoom,
    location,
  } = req.body;
  const updatedUnit = await Unit.findByIdAndUpdate(
    req.params.id,
    {
      title,
      type,
      description,
      area,
      price,
      image,
      bedrooms,
      bathrooms,
      livingrooms,
      waterTank,
      floor,
      maidRoom,
      driverRoom,
      location,
    },
    { new: true }
  );
  if (!updatedUnit) return res.status(404).json({ message: "Unit not found" });
  res.status(200).json({ message: "Unit updated successfully", updatedUnit });
};

const deleteUnit = async (req, res) => {
  const deletedUnit = await Unit.findByIdAndDelete(req.params.id);
  if (!deletedUnit) return res.status(404).json({ message: "Unit not found" });
  res.status(200).json({ message: "Unit deleted successfully", deletedUnit });
};

const getAllUnits = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sortBy = "price",
    sortOrder = "desc",
    search = "",
  } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      query[key] = filters[key];
    }
  });

  const skip = (page - 1) * limit;

  const units = await Unit.find(query)

    .sort({ [sortOrder]: sortBy === "desc" ? -1 : 1 })
    .skip(skip)
    .limit(limit);

    const totalDocs = await Unit.countDocuments(query);

  res.status(200).json({ message: "Success", units ,
    pagination: {
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
    },
   });
};

export { addUnit, getUnit, updateUnit, deleteUnit, getAllUnits };
