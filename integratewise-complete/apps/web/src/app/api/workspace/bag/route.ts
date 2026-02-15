// src/app/api/workspace/bag/route.ts
// Workspace Bag API - CRUD for user workspace configuration

import { NextRequest, NextResponse } from 'next/server';
import type { UserWorkspaceBag } from '@/types/workspace-bag';
import { getDefaultBagForRole } from '@/types/workspace-bag';

// In-memory store for development (replace with D1 in production)
const bagStore = new Map<string, UserWorkspaceBag>();

// ═══════════════════════════════════════════════════════════════
// GET - Retrieve user's workspace bag
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
        );
    }

    const bag = bagStore.get(userId);

    if (!bag) {
        return NextResponse.json(
            { error: 'Bag not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ bag });
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update user's workspace bag
// ═══════════════════════════════════════════════════════════════

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { bag } = body as { bag: UserWorkspaceBag };

        if (!bag || !bag.user_id) {
            return NextResponse.json(
                { error: 'Valid bag with user_id is required' },
                { status: 400 }
            );
        }

        // Validate bag structure
        if (!Array.isArray(bag.active_modules)) {
            return NextResponse.json(
                { error: 'active_modules must be an array' },
                { status: 400 }
            );
        }

        // Ensure 'home' is always first
        if (!bag.active_modules.includes('home')) {
            bag.active_modules.unshift('home');
        } else if (bag.active_modules[0] !== 'home') {
            bag.active_modules = ['home', ...bag.active_modules.filter(id => id !== 'home')];
        }

        // Update timestamp
        bag.updated_at = new Date().toISOString();

        // Store
        bagStore.set(bag.user_id, bag);

        return NextResponse.json({
            success: true,
            bag
        });
    } catch (error) {
        console.error('Failed to update workspace bag:', error);
        return NextResponse.json(
            { error: 'Failed to update bag' },
            { status: 500 }
        );
    }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new workspace bag with defaults
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, role = 'personal' } = body as { userId: string; role?: string };

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        // Check if bag already exists
        if (bagStore.has(userId)) {
            return NextResponse.json(
                { error: 'Bag already exists', bag: bagStore.get(userId) },
                { status: 409 }
            );
        }

        // Create default bag
        const bag: UserWorkspaceBag = {
            user_id: userId,
            active_modules: getDefaultBagForRole(role),
            pinned_widgets: [],
            module_settings: {},
            sidebar_collapsed: false,
            sidebar_position: 'left',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        bagStore.set(userId, bag);

        return NextResponse.json({
            success: true,
            bag
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to create workspace bag:', error);
        return NextResponse.json(
            { error: 'Failed to create bag' },
            { status: 500 }
        );
    }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Reset workspace bag to defaults
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') || 'personal';

    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
        );
    }

    // Create fresh default bag
    const bag: UserWorkspaceBag = {
        user_id: userId,
        active_modules: getDefaultBagForRole(role),
        pinned_widgets: [],
        module_settings: {},
        sidebar_collapsed: false,
        sidebar_position: 'left',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    bagStore.set(userId, bag);

    return NextResponse.json({
        success: true,
        message: 'Bag reset to defaults',
        bag
    });
}
