import Product from '../../../models/Product';
import dbConnect from '../../../lib/dbConnect';

const handler = async (req, res) => {
  await dbConnect();
  const product = await Product.findById(req.query.id);
  
  res.send(product);
};

export default handler;