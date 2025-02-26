// src/app/api/auth/signup/route.ts
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received signup data:', body);

    const { firstName, lastName, email, password, role } = body;

    // Detailed validation checking
    const validationErrors = [];
    
    if (!firstName?.trim()) validationErrors.push('First name is required');
    if (!lastName?.trim()) validationErrors.push('Last name is required');
    if (!email?.trim()) validationErrors.push('Email is required');
    if (!password?.trim()) validationErrors.push('Password is required');
    if (!role?.trim()) validationErrors.push('Role is required');

    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['Organizer', 'Co-organizer', 'Attendee'];
    if (!validRoles.includes(role)) {
      console.log('Invalid role:', role);
      return NextResponse.json(
        { message: 'Invalid role selected', role },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user - let the User model handle password hashing
    const user = new User({
      firstName,
      lastName,
      email,
      password, // Pass the plain password, let model hash it
      role
    });

    try {
      await user.validate();
    } catch (validationError: unknown) {
      console.log('Mongoose validation error:', validationError);
      
      const error = validationError as Error & { errors?: Record<string, { message: string }> };
      return NextResponse.json(
        { 
          message: 'Validation error',
          errors: error.errors ? Object.values(error.errors).map(err => err.message) : [error.message]
        },
        { status: 400 }
      );
    }

    await user.save();
    
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}