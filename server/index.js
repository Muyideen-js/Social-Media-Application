require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planType, userId, userEmail } = req.body;
    console.log('Received request:', { planType, userId, userEmail });

    const prices = {
      user: 'price_1QfQ5JEUexM9UyMhIwN1pPc0',  
      business: 'price_1QfQAjEUexM9UyMhVQY6w5g6' 
    };

    if (!prices[planType]) {
      throw new Error(`Invalid plan type: ${planType}`);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[planType],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5173/verification/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/verification',
      customer_email: userEmail,
      metadata: {
        userId,
        planType
      }
    });

    console.log('Created session:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});