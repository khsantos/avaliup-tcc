"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Product } from "@/src/types/Product";
import { useSupabase } from "@/src/contexts/supabase-provider";
import { useFavorite } from "@/src/hooks/useFavorite";
import { supabase } from "@/src/lib/supabase";

import ProductReviewView from "../ProductReview";
import PriceNotificationDialog from "../PriceNotificationDialog";
import ProductGallery from "../ProductGallery";
import ProductHeader from "../ProductHeader";
import ProductPrice from "../ProductPrice";
import ProductActions from "../ProductActions";
import ProductCriteriaStars from "../ProductCriteriaRatings";

interface RatingBreakdown {
  stars: number;
  percentage: number;
  count: number;
}

export default function ProductLayout({ product }: { product: Product }) {
  const { session } = useSupabase();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    isWishlisted,
    loading: favoriteLoading,
    toggleFavorite,
  } = useFavorite(product.id, session);

  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown[]>([
    { stars: 5, percentage: 0, count: 0 },
    { stars: 4, percentage: 0, count: 0 },
    { stars: 3, percentage: 0, count: 0 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const { signal } = controller;

    const fetchRatings = async () => {
      try {
        const { data: reviews, error } = await supabase
          .from("reviews")
          .select("rating")
          .eq("product_id", product.id)
          .abortSignal(signal);

        if (error || !isMounted || signal.aborted) return;

        const total = reviews?.length || 0;
        const countMap: Record<number, number> = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };

        reviews?.forEach(({ rating }) => {
          const rounded = Math.round(rating);
          if (rounded >= 1 && rounded <= 5) countMap[rounded]++;
        });

        if (!isMounted) return;

        setRatingBreakdown(
          [5, 4, 3, 2, 1].map((stars) => ({
            stars,
            count: countMap[stars],
            percentage:
              total > 0 ? Math.round((countMap[stars] / total) * 100) : 0,
          }))
        );
      } catch (err) {
        if (signal.aborted) return;
        console.error("Erro ao buscar avaliações:", err);
      }
    };

    fetchRatings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [product.id]);

  const MemoHeader = useMemo(
    () => (
      <ProductHeader
        name={product.name}
        rank={product.rank}
        category={product.category}
        rating={product.rating}
        reviewCount={product.review_count}
        ratingBreakdown={ratingBreakdown}
        productId={product.id}
      />
    ),
    [product, ratingBreakdown]
  );

  const MemoPrice = useMemo(
    () => (
      <ProductPrice
        lowestPrice={product.lowestPrice ?? undefined}
        lowestPlatform={product.lowestPlatform ?? undefined}
      />
    ),
    [product.lowestPrice, product.lowestPlatform]
  );

  const MemoActions = useMemo(
    () => (
      <ProductActions
        isWishlisted={isWishlisted}
        loading={favoriteLoading}
        session={session}
        onToggleFavorite={toggleFavorite}
        onShowForm={() => setShowForm(true)}
        onOpenNotification={() => setIsDialogOpen(true)}
      />
    ),
    [isWishlisted, favoriteLoading, session, toggleFavorite]
  );

  return (
    <div className="max-w-9xl mx-auto py-10">
      <AnimatePresence mode="sync">
        {!showForm ? (
          <motion.div
            key="layout"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start w-full px-2 max-w-6xl mx-auto">
              {/* Header no topo em mobile */}
              <div className="block lg:hidden w-full">{MemoHeader}</div>
              <ProductGallery
                images={product.images}
                selectedThumb={selectedThumb}
                setSelectedThumb={setSelectedThumb}
                productName={product.name}
                preloadFirst={true}
                align="right"
              />
              {/* ProductCriteriaStars abaixo da imagem no mobile */}
              <div className="block lg:hidden mt-6">
                <ProductCriteriaStars
                  productId={product.id}
                  rating={product.rating}
                  reviewCount={product.review_count}
                  ratingBreakdown={ratingBreakdown}
                />
              </div>
              <div className="flex-1 max-w-full lg:max-w-[600px] flex flex-col gap-4 self-start">
                {/* Header e ProductCriteriaStars na lateral em telas maiores */}
                <div className="hidden lg:block">{MemoHeader}</div>
                <div className="hidden lg:block">
                  <ProductCriteriaStars
                    productId={product.id}
                    rating={product.rating}
                    reviewCount={product.review_count}
                    ratingBreakdown={ratingBreakdown}
                  />
                </div>
                {MemoPrice}
                <div>
                  {MemoActions}
                  <PriceNotificationDialog
                    onOpenChange={setIsDialogOpen}
                    open={isDialogOpen}
                    productId={product.id}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductReviewView
              product={product}
              selectedThumb={selectedThumb}
              setSelectedThumb={setSelectedThumb}
              setShowForm={setShowForm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
