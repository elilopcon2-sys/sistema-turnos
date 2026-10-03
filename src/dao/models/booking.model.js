import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    services: {
      type: [
        {
          service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.model(
  "Booking",
  bookingSchema,
  "bookings"
);
