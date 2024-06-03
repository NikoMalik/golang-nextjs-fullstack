export interface User {
    id: string;
    name: string;
    avatar?: string | null;
    issubscribed?: boolean | null;
    isCanceled ?: boolean | null;
    stripeCurrentPeriodEnd ?: string | null;
    Plan ?: string | null;
   
    role: 'admin' | 'user';
    updatedAt: string;
    createdAt: string;
    email: string;
    resetPasswordToken?: string | null;
    resetPasswordExpiration?: string | null;
    salt?: string | null;
    hash?: string | null;
    verified?: boolean | null;
    verificationToken?: string | null;
    loginAttempts?: number | null;
    lockUntil?: string | null;
    password: string | null;
  }