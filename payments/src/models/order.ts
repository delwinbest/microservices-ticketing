import { OrderStatus } from '@drbtickets/common';
import mongoose from 'mongoose';

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

orderSchema.set('versionKey', 'version');

// **** Not Required because this service not authoritative for Order version ****
// Replaces updateIfCurrent module. DB agnostic
// orderSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1, // assumes we are incrementing versions by 1
//   };
//   done();
// });

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
