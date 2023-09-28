import * as model from 'dals';
import * as apiModel from './listingAndReviews.api-model';

export const mapListingAndReviewsFromModelToApi = (listingAndReviews: model.ListingAndReviews): apiModel.ListingAndReviews => ({
  id: listingAndReviews._id,
  listing_url: listingAndReviews.listing_url,
  description: listingAndReviews.description,
  country: listingAndReviews.address.country,
  bedrooms: listingAndReviews.bedrooms,
  beds: listingAndReviews.beds,
  bathrooms: listingAndReviews.bathrooms,
  street: listingAndReviews.address.street,
  city: listingAndReviews.address.market,
  // Sorting the reviews by latest date
  // TypeScript only allows us to do arithmetic operations with values of type any, number, bigint or enum.
  // The getTime method returns a number
  reviews: listingAndReviews.reviews.sort(function(a, b){ return b.date.getTime() - a.date.getTime() }).slice(0,5)  
});

export const mapListingAndReviewsListFromModelToApi = (
  listingAndReviewsList: model.ListingAndReviews[]
): apiModel.ListingAndReviews[] => Array.isArray(listingAndReviewsList) ? listingAndReviewsList.map(mapListingAndReviewsFromModelToApi) : [];

export const mapListingAndReviewsFromApiToModel = (listingAndReviews: apiModel.ListingAndReviews): model.ListingAndReviews => ({
  _id: listingAndReviews.id,
  listing_url: listingAndReviews.listing_url,
  description: listingAndReviews.description,
  bedrooms: listingAndReviews.bedrooms,
  beds: listingAndReviews.beds,
  bathrooms: listingAndReviews.bathrooms,
  address : {
    street: listingAndReviews.street,
    market:  listingAndReviews.city,
    country: listingAndReviews.country,
  }, 
  reviews: listingAndReviews.reviews.map(mapReviewFromApiToModel),
});

// Review mapping from Api to db
export const mapReviewFromApiToModel = (listingAndReviews: apiModel.Review): model.Review => ({ 
  listing_id: listingAndReviews.listing_id,
  date: new Date(),
  reviewer_name: listingAndReviews.reviewer_name,
  comments: listingAndReviews.comments,
});

export const mapReviewFromModelToApi = (listingAndReviews: model.Review): apiModel.Review => ({  
  listing_id: listingAndReviews.listing_id,
  date: listingAndReviews.date, 
  reviewer_name: listingAndReviews.reviewer_name,
  comments: listingAndReviews.comments,
});