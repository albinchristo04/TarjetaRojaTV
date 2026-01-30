import { useState } from 'react';

function getInitialConsentState() {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('cookie_consent');
}

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(getInitialConsentState);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShowBanner(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#1a1a1a] border-t border-white/10 p-4 md:p-6 shadow-2xl">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">We Value Your Privacy</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                        By clicking "Accept All", you consent to our use of cookies. We use Google AdSense to display advertisements. 
                        Read our <a href="/privacy-policy/" className="text-primary hover:underline">Privacy Policy</a> for more information.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={declineCookies}
                        className="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-white border border-white/20 rounded-lg transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={acceptCookies}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
