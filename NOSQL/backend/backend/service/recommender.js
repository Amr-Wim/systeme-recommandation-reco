const Product = require('../models/Product');
const Interaction = require('../models/Interaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// Configuration des poids
const CONFIG = {
    CONTENT_WEIGHT: 6,      
    WISHLIST_WEIGHT: 10,    
    CART_WEIGHT: 12,        // Le panier est maintenant très prioritaire
    CATEGORY_BONUS: 5
};

// Fonction de conversion sécurisée
const toId = (id) => {
    if (!id) return null;
    const strId = String(id);
    return mongoose.Types.ObjectId.isValid(strId) ? new mongoose.Types.ObjectId(strId) : null;
};

// Calcul de similarité simple par tags
function getSimilarity(tags1, tags2) {
    if (!tags1?.length || !tags2?.length) return 0;
    const s1 = new Set(tags1.map(t => String(t).toLowerCase()));
    const s2 = new Set(tags2.map(t => String(t).toLowerCase()));
    const intersect = [...s1].filter(t => s2.has(t)).length;
    const union = new Set([...s1, ...s2]).size;
    return intersect / union;
}

async function recommendForUser(userId, limit = 10) {
    try {
        const user = await User.findById(userId)
            .populate('history.product_id')
            .populate('wishlist.product_id')
            .populate('cart.product_id'); // On récupère le panier

        if (!user) return await Product.find().limit(limit);

        const history = user.history.map(h => h.product_id).filter(p => p?._id);
        const wishlist = user.wishlist.map(w => w.product_id).filter(p => p?._id);
        const cart = user.cart.map(c => c.product_id).filter(p => p?._id);

        const excludeIds = new Set([
            ...history.map(p => String(p._id)),
            ...cart.map(p => String(p._id)) // On n'affiche pas ce qui est déjà dans le panier
        ]);

        const candidates = await Product.find({ _id: { $nin: Array.from(excludeIds).map(toId) } }).lean();

        let scoredProducts = candidates.map(product => {
            let score = 0;
            let reasons = [];

            // 1. RECOMMANDATIONS BASÉES SUR LE PANIER (Cross-selling)
            cart.forEach(cartItem => {
                const sim = getSimilarity(product.tags, cartItem.tags);
                if (sim > 0) {
                    // Si même tags mais catégorie différente = ACCESSOIRE PARFAIT
                    if (product.category !== cartItem.category) {
                        score += (sim * CONFIG.CART_WEIGHT * 1.5);
                        reasons.push("Complémentaire Panier");
                    } else {
                        score += (sim * CONFIG.CART_WEIGHT * 0.5);
                    }
                }
            });

            // 2. RECOMMANDATIONS BASÉES SUR LA WISHLIST
            wishlist.forEach(wishItem => {
                const sim = getSimilarity(product.tags, wishItem.tags);
                if (sim > 0) {
                    score += (sim * CONFIG.WISHLIST_WEIGHT);
                    reasons.push("Similaire Wishlist");
                }
            });

            // 3. BONUS DE CATÉGORIE (Pour l'historique)
            history.forEach(past => {
                if (product.category === past.category) score += CONFIG.CATEGORY_BONUS;
            });

            return { product, score, reasons };
        });

        return scoredProducts
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => s.product);

    } catch (error) {
        console.error("Erreur Recommender:", error);
        return await Product.find().limit(limit);
    }
}

module.exports = { recommendForUser };