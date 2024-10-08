"use server"

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const formatAmountForStripe = (amount, currency) => {
    return Math.round(amount * 100)
   }

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try {
    if (!session_id) {
      throw new Error('Session ID is required')
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { plan } = await req.json();

    const price = plan === 'basic' ? 500 : 1000;  // $5.00 for Basic, $10.00 for Pro

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan === 'basic' ? 'Basic subscription' : 'Pro subscription',
            },
            unit_amount: formatAmountForStripe(price / 100, 'usd'),
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession, {
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    });
  }
}








