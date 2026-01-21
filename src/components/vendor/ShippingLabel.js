import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
    PrinterIcon, 
    XMarkIcon, 
    PhoneIcon, 
    EnvelopeIcon,
    GlobeAltIcon,
    PhotoIcon,
    DocumentArrowDownIcon,
    MapPinIcon,
    TruckIcon
} from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ====================================
// CONFIGURATION PLATEFORME OORYXX
// ====================================
const PLATFORM_CONFIG = {
    name: 'OORYXX',
    slogan: 'Votre Marketplace de Confiance',
    logo: '/Logo.png',
    contact: {
        phone: '+216 XX XXX XXX',
        email: 'support@ooryxx.com',
        website: 'www.ooryxx.com',
        address: 'Tunisie'
    },
    colors: {
        primary: '#FF6B35',      // Orange vif
        secondary: '#1E3A5F',    // Bleu marine
        accent: '#2ECC71'        // Vert succès
    }
};

const ShippingLabel = ({ order, onClose }) => {
    const printRef = useRef();
    const [downloading, setDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState(null);

    // Code livraison généré ou existant
    const deliveryCode = order.deliveryCode || `LIV-${order._id?.slice(-6).toUpperCase()}`;

    // Créer données QR code complètes pour le livreur
    const qrCodeData = JSON.stringify({
        // Identifiants
        deliveryCode: deliveryCode,
        orderNumber: order.orderNumber,
        orderId: order._id,
        
        // Informations destinataire
        recipient: {
            name: order.shippingAddress?.recipientName,
            phone: order.shippingAddress?.phone,
            address: order.shippingAddress?.street,
            city: order.shippingAddress?.city,
            postalCode: order.shippingAddress?.postalCode,
            country: order.shippingAddress?.country || 'Tunisie',
            instructions: order.shippingAddress?.instructions || ''
        },
        
        // Détails commande
        order: {
            itemsCount: order.items?.length || 0,
            totalAmount: order.totalAmount?.toFixed(2),
            currency: 'TND',
            paymentMethod: order.paymentMethod,
            isPaid: order.paymentMethod !== 'cash_on_delivery',
            amountToCollect: order.paymentMethod === 'cash_on_delivery' ? order.totalAmount?.toFixed(2) : '0.00'
        },
        
        // Métadonnées
        platform: PLATFORM_CONFIG.name,
        generatedAt: new Date().toISOString(),
        scanUrl: `${window.location.origin}/delivery/scan/${deliveryCode}`
    });

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;

        // Reload to restore React state
        window.location.reload();
    };

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;

        setDownloading(true);
        setDownloadType('pdf');

        try {
            const canvas = await html2canvas(element, {
                scale: 3, // Higher quality
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            // A6 size: 105mm x 148mm
            const pdf = new jsPDF('p', 'mm', 'a6');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Fit image to PDF page
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const finalWidth = imgWidth * ratio;
            const finalHeight = imgHeight * ratio;
            const x = (pdfWidth - finalWidth) / 2;
            const y = 0;

            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            pdf.save(`etiquette-${order.orderNumber || 'livraison'}.pdf`);
        } catch (error) {
            console.error("Erreur téléchargement PDF", error);
            alert("Erreur lors de la génération du PDF");
        } finally {
            setDownloading(false);
            setDownloadType(null);
        }
    };

    const handleDownloadImage = async () => {
        const element = printRef.current;
        if (!element) return;

        setDownloading(true);
        setDownloadType('image');

        try {
            const canvas = await html2canvas(element, {
                scale: 3,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `etiquette-${order.orderNumber || 'livraison'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Erreur téléchargement Image", error);
            alert("Erreur lors de la génération de l'image");
        } finally {
            setDownloading(false);
            setDownloadType(null);
        }
    };

    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-y-auto">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 z-10 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                            <TruckIcon className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Étiquette de Livraison</h2>
                            <p className="text-xs text-white/80">#{order.orderNumber}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* ===============================
                    ÉTIQUETTE IMPRIMABLE - REDESIGN
                   =============================== */}
                <div ref={printRef} className="p-4 bg-gradient-to-b from-gray-50 to-white">
                    <div 
                        className="border-2 border-gray-800 rounded-xl bg-white relative overflow-hidden shadow-lg" 
                        style={{ fontFamily: 'Arial, sans-serif', width: '100%', maxWidth: '420px', margin: '0 auto' }}
                    >
                        {/* Watermark arrière-plan */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center rotate-[-30deg]">
                            <span className="text-[120px] font-black uppercase text-gray-900">OORYXX</span>
                        </div>

                        {/* ===== EN-TÊTE AVEC LOGO PLATEFORME ===== */}
                        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 p-4 relative">
                            <div className="flex justify-between items-center">
                                {/* Logo et Nom Plateforme */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
                                        <img 
                                            src={PLATFORM_CONFIG.logo} 
                                            alt="OORYXX Logo" 
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-lg items-center justify-center">
                                            <span className="text-white font-black text-xl">O</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black text-white tracking-wide drop-shadow-md">
                                            {PLATFORM_CONFIG.name}
                                        </h1>
                                        <p className="text-[10px] text-white/90 font-medium">
                                            {PLATFORM_CONFIG.slogan}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Badge Type */}
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                        Livraison Express
                                    </span>
                                </div>
                            </div>

                            {/* Bande décorative */}
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"></div>
                        </div>

                        {/* ===== CODE LIVRAISON - SECTION PRINCIPALE ===== */}
                        <div className="bg-gray-900 text-white p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                        🚚 Code Livraison
                                    </p>
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-lg inline-block">
                                        <span className="font-mono font-black text-2xl tracking-widest text-white">
                                            {deliveryCode}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 mb-1">N° Commande</p>
                                    <p className="font-mono font-bold text-white text-sm">{order.orderNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* ===== CORPS DE L'ÉTIQUETTE ===== */}
                        <div className="p-5 space-y-5">

                            {/* QR CODE + INFOS RAPIDES */}
                            <div className="flex gap-4">
                                {/* QR Code pour livreur */}
                                <div className="flex flex-col items-center bg-white border-2 border-gray-800 rounded-xl p-3 shadow-md">
                                    <QRCodeSVG
                                        value={qrCodeData}
                                        size={100}
                                        level="H"
                                        includeMargin={false}
                                        bgColor="#ffffff"
                                        fgColor="#1a1a1a"
                                    />
                                    <div className="mt-2 text-center">
                                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider">
                                            Scanner pour détails
                                        </p>
                                        <p className="text-[7px] text-gray-400">Livreur uniquement</p>
                                    </div>
                                </div>

                                {/* Infos résumées */}
                                <div className="flex-1 space-y-2">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                                        <p className="text-[9px] uppercase text-gray-500 font-semibold">Date</p>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {new Date().toLocaleDateString('fr-TN', { 
                                                day: '2-digit', 
                                                month: 'short', 
                                                year: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                                        <p className="text-[9px] uppercase text-gray-500 font-semibold">Articles</p>
                                        <p className="font-bold text-gray-800 text-lg">{order.items?.length || 0}</p>
                                    </div>
                                    <div className={`rounded-lg p-2 ${order.paymentMethod === 'cash_on_delivery' 
                                        ? 'bg-red-50 border-2 border-red-300' 
                                        : 'bg-green-50 border border-green-200'}`}>
                                        <p className="text-[9px] uppercase font-bold" style={{ 
                                            color: order.paymentMethod === 'cash_on_delivery' ? '#dc2626' : '#16a34a' 
                                        }}>
                                            {order.paymentMethod === 'cash_on_delivery' ? '💰 À Encaisser' : '✅ Payé'}
                                        </p>
                                        <p className="font-black text-lg" style={{ 
                                            color: order.paymentMethod === 'cash_on_delivery' ? '#dc2626' : '#16a34a' 
                                        }}>
                                            {order.totalAmount?.toFixed(2)} <span className="text-xs font-normal">TND</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Séparateur */}
                            <div className="flex items-center gap-2">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                                <MapPinIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Destinataire</span>
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                            </div>

                            {/* DESTINATAIRE */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {order.shippingAddress?.recipientName?.charAt(0).toUpperCase() || 'C'}
                                    </span>
                                    {order.shippingAddress?.recipientName}
                                </h3>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                        <PhoneIcon className="w-4 h-4 text-orange-500" />
                                        <span className="font-mono font-semibold text-gray-800">
                                            {order.shippingAddress?.phone}
                                        </span>
                                    </div>
                                    
                                    <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
                                        <div className="flex items-start gap-2">
                                            <MapPinIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-gray-700">
                                                <p className="font-medium">{order.shippingAddress?.street}</p>
                                                <p className="font-bold text-gray-900">
                                                    {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                                                </p>
                                                <p className="text-gray-500">{order.shippingAddress?.country || 'Tunisie'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {order.shippingAddress?.instructions && (
                                        <div className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg">
                                            <p className="text-[10px] font-bold text-yellow-700 uppercase mb-1">📝 Instructions</p>
                                            <p className="text-xs text-yellow-800 italic">
                                                {order.shippingAddress.instructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== PIED DE PAGE - CONTACT PLATEFORME ===== */}
                            <div className="bg-gray-800 text-white rounded-xl p-4 -mx-1">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                                        Contact Plateforme
                                    </p>
                                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                        <img 
                                            src={PLATFORM_CONFIG.logo} 
                                            alt="" 
                                            className="w-5 h-5 object-contain"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-gray-300">{PLATFORM_CONFIG.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <EnvelopeIcon className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-gray-300">{PLATFORM_CONFIG.contact.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2">
                                        <GlobeAltIcon className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-gray-300">{PLATFORM_CONFIG.contact.website}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ===== BANDE INFÉRIEURE ===== */}
                        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 h-3"></div>
                    </div>
                </div>

                {/* ===============================
                    BOUTONS D'ACTION AMÉLIORÉS
                   =============================== */}
                <div className="p-4 border-t sticky bottom-0 bg-white space-y-3">
                    {/* Téléchargement */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            className="py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading && downloadType === 'pdf' ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <DocumentArrowDownIcon className="w-5 h-5" />
                            )}
                            Télécharger PDF
                        </button>
                        <button
                            onClick={handleDownloadImage}
                            disabled={downloading}
                            className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading && downloadType === 'image' ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <PhotoIcon className="w-5 h-5" />
                            )}
                            Télécharger Image
                        </button>
                    </div>
                    
                    {/* Imprimer */}
                    <button
                        onClick={handlePrint}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
                    >
                        <PrinterIcon className="w-5 h-5" />
                        Imprimer l'étiquette
                    </button>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    body {
                        background: white !important;
                        margin: 0;
                        padding: 0;
                    }
                    .printable, .printable * {
                        visibility: visible;
                    }
                    .printable {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 5mm;
                        box-sizing: border-box;
                    }
                    @page {
                        size: A6;
                        margin: 3mm;
                    }
                }
            `}</style>
        </div>
    );
};

export default ShippingLabel;
