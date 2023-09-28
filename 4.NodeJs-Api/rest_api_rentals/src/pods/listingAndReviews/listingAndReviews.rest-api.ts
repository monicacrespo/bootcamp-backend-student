import { Router } from 'express';
import { listingAndReviewsRepository, Review } from 'dals';
import {
  mapListingAndReviewsListFromModelToApi,
  mapListingAndReviewsFromModelToApi,
  mapReviewFromApiToModel,
  mapReviewFromModelToApi,
  mapListingAndReviewsFromApiToModel,
} from './listingAndReviews.mappers';
import { authenticationMiddleware } from 'pods/security/security.middleware';
import { authorizationMiddleware } from 'pods/security';

export const listingsAndReviewsApi = Router();

listingsAndReviewsApi
  // Display all listings and its reviews. If country is given, returns the listings that matches that criteria. Sames happens with page & pageSize
  .get('/', async (req, res, next) => {
    try {
      const country = String(req.query.country);
      const pageSize = Number(req.query.pageSize);
      const page = Number(req.query.page);
      const listingList = await listingAndReviewsRepository.getListingAndReviewsList(country, page, pageSize);
      listingList.length >= 1
        ? res.send(mapListingAndReviewsListFromModelToApi(listingList))
        : res.send('We could not find what you are looking for right now')
    } catch (error) {
      next(error);
    }
  })
   // Display all details of a listing
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const listing = await listingAndReviewsRepository.getListingAndReviews(id);
      listing
        ? res.send(mapListingAndReviewsFromModelToApi(listing))
        : res.send('The property requested is not found');
    } catch (error) {
      next(error);
    }
  }) 
  // Add a new review
  // id used to filter the listing
  .put('/:id/reviews', async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = mapReviewFromApiToModel(req.body);
      let newReview = await listingAndReviewsRepository.insertReview(
        id,
        review
      );
      res.send(mapReviewFromModelToApi(newReview));
    } catch (error) {
      next(error);
    }
  })
  // Update a listing
  .put('/:id', authorizationMiddleware(['admin']), async (req, res, next) => {   
    try {
      const { id } = req.params;
      const updatedListingAndReviews = mapListingAndReviewsFromApiToModel(req.body);
      await listingAndReviewsRepository.updateListingAndReviews(id, updatedListingAndReviews);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  })
  // Add a listing
  .post('/', authorizationMiddleware(['admin']), async (req, res, next) => {
    try {
      const listingAndReviews = mapListingAndReviewsFromApiToModel(req.body);
      const newlistingAndReviews = await listingAndReviewsRepository.insertListingAndReviews(listingAndReviews);
      res.status(201).send(mapListingAndReviewsFromModelToApi(newlistingAndReviews));
    } catch (error) {
      next(error);
    }
  });