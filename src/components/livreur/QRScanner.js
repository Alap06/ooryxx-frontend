import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);
    const [manualCode, setManualCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);
    const html5QrCode = useRef(null);

    useEffect(() => {
        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        try {
            html5QrCode.current = new Html5Qrcode("qr-reader");

            await html5QrCode.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    // Extract code from QR (format: LIV-XXXXXX)
                    const code = decodedText.includes('LIV-')
                        ? decodedText.match(/LIV-[A-Z0-9]+/)?.[0]
                        : decodedText;

                    if (code) {
                        stopScanner();
                        onScan(code);
                    }
                },
                (errorMessage) => {
                    // Ignore scan errors (just means no QR found in frame)
                }
            );

            setIsScanning(true);
            setError(null);
        } catch (err) {
            console.error('Scanner error:', err);
            setError('Impossible d\'accéder à la caméra. Vérifiez les permissions ou entrez le code manuellement.');
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrCode.current && html5QrCode.current.isScanning) {
            try {
                await html5QrCode.current.stop();
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            const code = manualCode.trim().toUpperCase();
            onScan(code.startsWith('LIV-') ? code : `LIV-${code}`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex justify-between items-center">
                    <h2 className="text-white font-semibold text-lg">Scanner le code QR</h2>
                    <button
                        onClick={() => {
                            stopScanner();
                            onClose();
                        }}
                        className="p-2 bg-white/20 rounded-full"
                    >
                        <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Scanner Area */}
            <div className="flex items-center justify-center h-full">
                <div className="relative">
                    <div
                        id="qr-reader"
                        ref={scannerRef}
                        className="w-80 h-80 rounded-2xl overflow-hidden"
                    />

                    {/* Scanning overlay */}
                    {isScanning && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-4 border-2 border-white/50 rounded-xl">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                            </div>
                            {/* Scan line animation */}
                            <div className="absolute left-4 right-4 h-0.5 bg-green-400 animate-scan"></div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-2xl">
                            <div className="text-center p-6">
                                <VideoCameraSlashIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-white text-sm mb-4">{error}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Input */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white/70 text-center text-sm mb-3">
                    Ou entrez le code manuellement
                </p>
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Ex: LIV-A1B2C3"
                        className="flex-1 px-4 py-3 bg-white/20 text-white placeholder-white/50 rounded-xl border border-white/30 focus:border-white focus:outline-none uppercase"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
                    >
                        OK
                    </button>
                </form>
            </div>

            {/* CSS for scan animation */}
            <style jsx>{`
                @keyframes scan {
                    0% { top: 1rem; }
                    50% { top: calc(100% - 1rem); }
                    100% { top: 1rem; }
                }
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default QRScanner;
