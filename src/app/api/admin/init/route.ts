import { NextRequest, NextResponse } from 'next/server';
// Admin initialization is not needed with simple auth

export async function POST() {
  try {
    console.log('🔐 Simple admin auth - no initialization needed');
    
    return NextResponse.json({
      message: 'Simple admin auth is ready',
      success: true
    });
  } catch (error) {
    console.error('Error initializing admin system:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin system' }, 
      { status: 500 }
    );
  }
}
