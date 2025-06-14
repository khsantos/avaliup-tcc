"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Star, Heart, Share2, MousePointer, Zap, Award, Shield } from "lucide-react"
import Image from "next/image"

export default function ProductLayout() {
    const [selectedThumb, setSelectedThumb] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const thumbnails = [{ icon: MousePointer }, { icon: Zap }, { icon: Award }, { icon: Shield }]

    const ratingBreakdown = [
        { stars: 5, percentage: 75 },
        { stars: 4, percentage: 15 },
        { stars: 3, percentage: 6 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 1 },
    ]

    const characteristics = [
        { name: "Performance", rating: 4.5 },
        { name: "Custo-benefício", rating: 4.8 },
        { name: "Conforto", rating: 4.3 },
        { name: "Preço", rating: 4.6 },
        { name: "Durabilidade", rating: 4.2 },
    ]

    const renderStars = (rating: number, showEmpty = true) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0
        const emptyStars = showEmpty ? 5 - fullStars - (hasHalfStar ? 1 : 0) : 0

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
                {hasHalfStar && <Star className="w-4 h-4 fill-orange-400 text-orange-400" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white">
            <div className="flex gap-6">
                {/* Left Side - Thumbnails and Main Image */}
                <div className="flex gap-4">
                    {/* Vertical Thumbnails */}
                    <div className="flex flex-col gap-2">
                        {thumbnails.map((thumb, index) => {
                            const Icon = thumb.icon
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedThumb(index)}
                                    className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${selectedThumb === index
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                >
                                    <Icon className="w-5 h-5 text-gray-600" />
                                </button>
                            )
                        })}
                    </div>

                    {/* Main Product Image */}
                    <div className="w-80 h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Image
                            src="/placeholder.svg?height=280&width=280"
                            alt="Mouse Zaopin-Z2"
                            width={280}
                            height={280}
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Right Side - Product Information */}
                <div className="flex-1 space-y-4">
                    {/* Top Badge */}
                    <div className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">Top #1 - Mouses gamers custo-benefício</span>
                    </div>

                    {/* Product Title and Share */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Mouse Zaopin-Z2 4K Hotswappable Wireless</h1>
                        <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Rating Section */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-orange-500">4.9</span>
                            {renderStars(4.9)}
                        </div>
                        <span className="text-gray-600 text-sm">12.321 avaliações</span>
                    </div>

                    {/* Rating Breakdown Bars */}
                    <div className="space-y-1">
                        {ratingBreakdown.map((item) => (
                            <div key={item.stars} className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 w-2">{item.stars}</span>
                                <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-48">
                                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                                </div>
                                <span className="text-xs text-gray-600">{item.stars}</span>
                            </div>
                        ))}
                    </div>

                    {/* Characteristics - Horizontal Layout */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Avaliações por características</h3>
                        <div className="flex gap-6">
                            {characteristics.map((char, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-xs text-gray-700 mb-1">{char.name}</div>
                                    {renderStars(char.rating)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="pt-2">
                        <div className="text-2xl font-bold text-gray-900">R$335,00</div>
                        <div className="text-xs text-gray-600">à vista</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button className="bg-blue-900 hover:bg-blue-800 text-white px-6">Avaliar Produto</Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={isWishlisted ? "text-red-500 border-red-500" : ""}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
