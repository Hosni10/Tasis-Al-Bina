import { model, Schema } from "mongoose"

const newsletterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  }
}, { timestamps: true })

export const newsletterModel = model("Newsletter", newsletterSchema)
