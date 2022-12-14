import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import dbConnect from '../../../lib/dbConnect';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    await dbConnect();
    const orders = await Order.find({}).populate('user', 'name');
   
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;