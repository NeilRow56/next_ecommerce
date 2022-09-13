import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/userModel'
import dbConnect from '../../../lib/dbConnect';

const handler = async (req, res) => {
  const session = await getSession({ req });
  
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  await dbConnect();

  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

export default handler;