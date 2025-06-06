import DataType from "sequelize";
import Model from "../sequelize";

const Reservation = Model.define("Reservation", {
  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  listId: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  hostId: {
    type: DataType.STRING,
    allowNull: false,
  },
  guestId: {
    type: DataType.STRING,
    allowNull: false,
  },
  checkIn: {
    type: DataType.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataType.DATE,
    allowNull: false,
  },
  guests: {
    type: DataType.INTEGER,
    defaultValue: 1,
  },
  message: {
    type: DataType.TEXT,
  },
  basePrice: {
    type: DataType.FLOAT,
    allowNull: false,
  },
  delivery: {
    type: DataType.FLOAT,
  },
  currency: {
    type: DataType.STRING,
    allowNull: false,
  },
  discount: {
    type: DataType.FLOAT,
  },
  discountType: {
    type: DataType.STRING,
  },
  guestServiceFee: {
    type: DataType.FLOAT,
  },
  hostServiceFee: {
    type: DataType.FLOAT,
  },
  total: {
    type: DataType.FLOAT,
    allowNull: false,
  },
  confirmationCode: {
    type: DataType.INTEGER,
  },
  payoutId: {
    type: DataType.INTEGER,
  },
  reservationState: {
    type: DataType.ENUM(
      "pending",
      "expired",
      "approved",
      "declined",
      "completed",
      "cancelled"
    ),
    defaultValue: "pending",
  },
  paymentState: {
    type: DataType.ENUM("pending", "completed"),
    defaultValue: "pending",
  },
  paymentMethodId: {
    type: DataType.INTEGER,
  },
  cancellationPolicy: {
    type: DataType.INTEGER,
  },
  isSpecialPriceAverage: {
    type: DataType.FLOAT,
  },
  dayDifference: {
    type: DataType.FLOAT,
  },
  startTime: {
    type: DataType.FLOAT,
  },
  endTime: {
    type: DataType.FLOAT,
  },
  licenseNumber: {
    type: DataType.STRING,
  },
  firstName: {
    type: DataType.STRING,
  },
  middleName: {
    type: DataType.STRING,
  },
  lastName: {
    type: DataType.STRING,
  },
  dateOfBirth: {
    type: DataType.STRING,
  },
  countryCode: {
    type: DataType.STRING,
  },
  paymentIntentId: {
    type: DataType.STRING,
  },
  securityDeposit: {
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  claimStatus: {
    type: DataType.ENUM("pending", "approved", "requested", "fullyRefunded"),
    defaultValue: "pending",
  },
  claimAmount: {
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  claimPayout: {
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  claimRefund: {
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  claimReason: {
    type: DataType.TEXT("long"),
  },
  isClaimCancelStatus: {
    type: DataType.BOOLEAN,
    defaultValue: 0,
  },
  listTitle: {
    type: DataType.STRING,
  },
  hostServiceFeeType: {
    type: DataType.STRING,
  },
  hostServiceFeeValue: {
    type: DataType.FLOAT,
  },
  bookingType: {
    type: DataType.STRING
  },
  payoutTransactionId: {
    type: DataType.STRING
  }
});

export default Reservation;
