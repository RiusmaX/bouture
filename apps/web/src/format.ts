const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const dates = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });

export const formatPrice = (priceCents: number) => euros.format(priceCents / 100);

// Les dates voyagent en texte ISO (2026-11-27T09:30:00.000Z) : on les affiche à la française
export const formatDate = (iso: string) => dates.format(new Date(iso));
