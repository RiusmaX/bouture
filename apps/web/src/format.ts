const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export const formatPrice = (priceCents: number) => euros.format(priceCents / 100);
