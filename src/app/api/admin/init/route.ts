import { NextRequest, NextResponse } from 'next/server';
import { initializeAdminSystem } from '@/lib/data/admin-actions';

export async function POST() {
  try {
    console.log('🔐 Initializing admin system...');
    
    const result = await initializeAdminSystem();
    
    return NextResponse.json({
      message: 'Admin system initialized successfully',
      result
    });
  } catch (error) {
    console.error('Error initializing admin system:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin system' }, 
      { status: 500 }
    );
  }
}
