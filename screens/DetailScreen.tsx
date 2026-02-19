import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star, MapPin, Clock, Phone, Navigation, Globe, Share2, CheckCircle } from 'lucide-react';
import { Restaurant } from '../types';
import { Button, Badge } from '../components/Shared';

interface DetailScreenProps {
    restaurant: Restaurant;
    onBack: () => void;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ restaurant, onBack }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState<any[]>(restaurant.reviews || []);

    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem('locato_favorites') || '[]');
        const exists = favs.some((r: Restaurant) => r.id === restaurant.id);
        setIsFavorite(exists);

        // Load local reviews
        const localReviews = JSON.parse(localStorage.getItem(`locato_reviews_${restaurant.id}`) || '[]');
        if (localReviews.length > 0) {
            setReviews([...localReviews, ...(restaurant.reviews || [])]);
        }
    }, [restaurant.id, restaurant.reviews]);

    const toggleFavorite = () => {
        const favs = JSON.parse(localStorage.getItem('locato_favorites') || '[]');
        let newFavs;

        if (isFavorite) {
            newFavs = favs.filter((r: Restaurant) => r.id !== restaurant.id);
        } else {
            newFavs = [...favs, restaurant];
        }

        localStorage.setItem('locato_favorites', JSON.stringify(newFavs));
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        const shareData = {
            title: restaurant.name,
            text: `Pogledaj ovaj restoran: ${restaurant.name}\n${restaurant.description}`,
            url: restaurant.websiteUrl || restaurant.googleMapsUri || window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback for browsers that don't support navigator.share
            alert(`Podijeli: ${shareData.title}\n${shareData.url}`);
        }
    };

    const handleReservation = () => {
        console.log(`Reservation initiated for restaurant ID: ${restaurant.id}`);
        // In a real app, this would open a modal or navigate to a reservation form
        alert(`Vaš zahtjev za rezervaciju u restoranu "${restaurant.name}" je uspješno primljen!`);
    };

    const handleSubmitReview = () => {
        if (rating === 0) {
            alert("Molimo ocijenite restoran.");
            return;
        }

        const newReview = {
            id: Date.now().toString(),
            user: "Vi", // Hardcoded for now, would use actual user data
            rating,
            comment,
            date: "Upravo sada"
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);

        // Save to local storage
        const localReviews = JSON.parse(localStorage.getItem(`locato_reviews_${restaurant.id}`) || '[]');
        localStorage.setItem(`locato_reviews_${restaurant.id}`, JSON.stringify([newReview, ...localReviews]));

        setShowReviewModal(false);
        setRating(0);
        setComment('');
    };

    return (
        <div className="bg-white pb-24 relative animate-fade-in">
            {/* Header Image */}
            <div className="relative h-80 w-full">
                <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover rounded-b-[2.5rem]"
                />
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pt-6">
                    <button
                        onClick={onBack}
                        className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleShare}
                            className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-blue-500 transition-colors"
                        >
                            <Share2 size={24} />
                        </button>
                        <button
                            onClick={toggleFavorite}
                            className={`bg-white/20 backdrop-blur-md p-3 rounded-full transition-colors ${isFavorite ? 'bg-white text-red-500' : 'text-white hover:bg-white hover:text-red-500'}`}
                        >
                            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 -mt-10 relative z-10">

                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2 shadow-sm">{restaurant.name}</h1>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="bg-orange-500 px-2 py-0.5 rounded text-white">{restaurant.rating}</span>
                        <span>• {restaurant.cuisine}</span>
                        <span>• {restaurant.distance}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="relative -mt-6 bg-white dark:bg-gray-900 rounded-t-[2.5rem] px-6 pt-8 overflow-hidden transition-colors duration-300">

                {/* Action Buttons */}
                <div className="flex justify-between gap-4 mb-8">
                    <Button variant="primary" onClick={handleReservation} className="shadow-orange-200 dark:shadow-none">
                        Rezerviši stol
                    </Button>
                    <Button variant="secondary" className="shadow-emerald-200 dark:shadow-none bg-emerald-600">
                        <Navigation size={20} />
                        Uputstvo
                    </Button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Otvoreno</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">08:00 - 23:00</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Lokacija</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{restaurant.address.split(',')[0]}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Telefon</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">033 123 456</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Web</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Posjeti</p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">O restoranu</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                        {restaurant.description}
                    </p>
                </div>

                {/* Reviews Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Recenzije</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500">{reviews.length} recenzija</span>
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                            >
                                + Napiši recenziju
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((review: any) => (
                                <div key={review.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-xs">
                                                {review.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{review.user}</p>
                                                <p className="text-[10px] text-gray-400">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-orange-400 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300 dark:text-gray-600"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-2xl transition-colors">
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">Nema još recenzija.</p>
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="mt-2 text-orange-500 font-bold text-sm hover:underline"
                                >
                                    Budite prvi!
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-scale-up border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Napiši recenziju</h3>
                            <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <ArrowLeft size={24} className="rotate-180" /> {/* Using arrow as close for now or could import X */}
                            </button>
                        </div>

                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-transform active:scale-90"
                                >
                                    <Star
                                        size={32}
                                        className={star <= rating ? "text-orange-400 fill-orange-400" : "text-gray-300 dark:text-gray-600"}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Kakvo je bilo vaše iskustvo?"
                            className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 min-h-[120px] text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400 resize-none transition-colors"
                        />

                        <Button onClick={handleSubmitReview} className="w-full py-4 text-base shadow-orange-200 dark:shadow-none">
                            Pošalji recenziju
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailScreen;