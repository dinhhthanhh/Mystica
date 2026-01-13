'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            // Store tokens and set initial auth state
            authService.setTokens(accessToken, refreshToken);

            // Fetch full user profile and then redirect
            authService.getMe()
                .then(() => {
                    router.push('/');
                })
                .catch(() => {
                    router.push('/login?error=user_fetch_failed');
                });
        } else {
            // Handle error
            router.push('/login?error=social_auth_failed');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mystic-gold mx-auto"></div>
                <p className="text-mystic-gold font-mystic">Đang kết nối hành trình của bạn...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackHandler />
        </Suspense>
    );
}
