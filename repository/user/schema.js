const Schema = require('mongoose').Schema;

const { userType } = require('../../constants');

/* Creating a schema for the user model. */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(userType),
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      default: null,
    },
    activeOrders: {
      type: Array(Schema.Types.ObjectId),
      ref: 'Order',
      default: []
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.index({ type: 1 });

module.exports = (mongoDb) => {
  return mongoDb.model('User', UserSchema);
};
