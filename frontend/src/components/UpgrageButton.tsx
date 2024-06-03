"use client"
import { useState } from 'react';
import { Button } from './ui/Button';
import { useUser } from '@/components/Usercontext';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from './sessionId';


const UpgradeButton = ({ user, plan, priceId }) => {
  const [loading, setLoading] = useState(false);
  

  
  
  const handleUpgrade = async () => {
    setLoading(true);
    try {
     
      const response = await fetch(`http://localhost:8000/api/checkout?priceId=${priceId}&plan=${plan}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

    
      const { sessionId } = await response.json();

   
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

     
      const result = await stripe.redirectToCheckout({ sessionId });
      
      
      if (result.error) {
        console.error('Error redirecting to Checkout:', result.error);
      } else {
        // 
        window.location.href = `/success?sessionId=${sessionId}`;
      }
    } catch (error) {
      console.error('Error creating Stripe session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} disabled={loading}>
      {loading ? 'Processing...' : `Upgrade to ${plan}`}
    </Button>
  );
};

export default UpgradeButton;

